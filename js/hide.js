function FromSeed(symbols, seed, length) {
    this.symbols = symbols;
    this.seed = seed;
    this.length = length;
    this.random = new Math.seedrandom(seed);
    this.dictGroup = this.getDictGroup();
    this.undictGroup = this.getUndictGroup();
    this.order = this.getOrder();
    this.unorder = this.getUnorder();
    console.log(string2unicode(this.dictGroup[4][3]));
}
FromSeed.prototype.fakeShuffle = function (arr, random) {
    var length = arr.length,
        temp,
        random_;
    while (0 != length) {
        random_ = Math.floor(random() * length);
        length--;
        temp = arr[length];
        arr[length] = arr[random_];
        arr[random_] = temp;
    }
    return arr;
}
FromSeed.prototype.getDict = function () {
    var arr = this.fakeShuffle(Array.from(this.symbols), this.random).slice(0, 16);
    var dict = {};
    for (let i = 0; i < arr.length; i++) {
        dict[i.toString(16)] = arr[i];
    }
    return dict;
}
FromSeed.prototype.getDictGroup = function () {
    var dictGroup = [];
    for (let i = 0; i < 16; i++) {
        let dict = this.getDict();
        dictGroup[i] = dict;
    }
    return dictGroup;
}
FromSeed.prototype.getUndictGroup = function () {
    var undictGroup = [];
    for (let i = 0; i < 16; i++) {
        let undict = invertKeyValues(this.dictGroup[i])
        undictGroup.push(undict);
    }
    return undictGroup;
}
FromSeed.prototype.getOrder = function () {
    var order = {};
    var arr = [];
    for (let i = 0; i < this.length; i++) {
        arr.push(i);
    }
    arr = this.fakeShuffle(arr, this.random);
    for (let i = 0; i < this.length; i++) {
        order[i] = arr[i];
    }
    return order;
}
FromSeed.prototype.getUnorder = function () {
    return invertKeyValues(this.order);
}

function WordsDeep() {
    this.defaultSymbols = [
        '\u200b',
        '\u200c',
        '\u200d',
        '\u200e',
        '\u200f',
        '\u202a',
        '\u202b',
        '\u202c',
        '\u2060',
        '\u2061',
        '\u2062',
        '\u2063',
        '\u2064',
        '\u2065',
        '\u2066',
        '\u2067',
        '\u2068',
        '\u2069',
        '\u206a',
        '\u206b',
        '\u206c',
        '\u206d',
        '\u206e',
        '\u206f'
    ];
    this.symbolsReg = /[\u200b-\u200f\u202a-\u202d\u2060-\u206f]+/;
}
WordsDeep.prototype.hide = function (binary, password) {
    var fromSeed = new FromSeed(this.defaultSymbols, password, binary.length * 2);
    console.log(fromSeed);
    var first = '';
    for (let i in binary) {
        let code16 = binary.charCodeAt(i).toString(16);
        if (code16.length < 2) {
            code16 = '0' + code16;
        }
        for (let j of code16) {
            first += fromSeed.dictGroup[i%16][j];
        }
    }
    var second = [];
    for (let i in fromSeed.order) {
        second[i] = first[fromSeed.order[i]];
    }
    return second.join("");
}
WordsDeep.prototype.unhide = function (hidden, password) {
    var fromSeed = new FromSeed(this.defaultSymbols, password, hidden.length);
    console.log(fromSeed);
    var unordered = [];
    for (let i in fromSeed.unorder) {
        unordered[i] = hidden[fromSeed.unorder[i]];
    }
    unordered = unordered.join('');
    var binary = ''
    for (let i = 0; i < unordered.length; i += 2) {
        let undict = fromSeed.undictGroup[(i/2)%16];
        let code16 = undict[unordered[i]] + undict[unordered[i + 1]];
        binary += String.fromCharCode(parseInt(code16, 16));
    }
    return binary;
}
const invertKeyValues = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});
WordsDeep.prototype.compress = function (text) {
    return pako.gzip(text, {
        to: 'string'
    });
}
WordsDeep.prototype.uncompress = function (binary) {
    return pako.ungzip(binary, {
        to: 'string'
    });
}

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});

var wd = new WordsDeep();
$('.start-mixin').click(function () {
    var text = $('#textin').val();
    if ($('#if-encrypt')[0].checked) {
        var password = $('#password').val();
    } else {
        var password = '';
    }
    var back = $('#back-mode')[0].checked;
    var ifCompress = $('#if-compress')[0].checked;
    if (back) {
        let hiddenStr = text.match(wd.symbolsReg)[0];
        if (ifCompress) {
            let binaryStr = wd.unhide(hiddenStr, password);
            console.log(binaryStr);
            var factStr = wd.uncompress(binaryStr);
        } else {
            var factStr = wd.unhide(hiddenStr, password);
        }
        text = text.replace(hiddenStr, factStr);
    } else {
        if (ifCompress) {
            text = wd.compress(text);
        };
        console.log('compressed: ' + text);
        text = wd.hide(text, password);
    }
    result = ' ' + text + ' ';
    $('pre.result').text(result);
    $('.to-copy').attr('data-clipboard-text', result);
});

$('#if-encrypt').click(function () {
    if ($(this)[0].checked) {
        $('div.password').css('display', 'block');
    } else {
        $('div.password').css('display', 'none');
    }
});

function string2unicode(text, mode2 = false, filter) {
    var result = '';
    if (filter) {
        var reg = new RegExp('[' + filter + ']');
    }
    if (mode2) {
        var list = Array.from(text);
        for (let i of list) {
            if (filter && reg.test(i)) {
                result += i;
            } else {
                result += ustr(i.codePointAt(0));
            }
        }
    } else {
        for (let i in text) {
            if (filter && reg.test(text[i])) {
                result += text[i];
            } else {
                result += ustr(text.charCodeAt(i));
            }
        }
    }
    return result;
}

function ustr(code) {
    var code16 = code.toString(16);
    if (code < 0xf) {
        return "\\u" + "000" + code16;
    } else if (code <= 0xff) {
        return "\\u" + "00" + code16;
    } else if (code <= 0xfff) {
        return "\\u" + "0" + code16;
    } else if (code <= 0xffff) {
        return "\\u" + code16;
    } else {
        return "\\u{" + code16 + "}";
    }
}
