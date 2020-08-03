function FromSeed(symbols, seed, length) {
    this.symbols = symbols;
    this.seed = seed;
    this.length = length;
    this.random = new Math.seedrandom(seed);
    this.dictGroup = this.getDictGroup();
    this.undictGroup = this.getUndictGroup();
    this.order = this.getOrder();
    this.unorder = this.getUnorder();
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
    this.symbolsReg = /\u202d([\u200b-\u200f\u202a-\u202d\u2060-\u206f]+)\u202d/;
}
WordsDeep.prototype.hexStrToHidden = function (hexStr, password) {
    var fromSeed = new FromSeed(this.defaultSymbols, password, hexStr.length);
    var first = '';
    for (let i in hexStr) {
        first += fromSeed.dictGroup[i % 16][hexStr[i]];
    }
    var hidden = [];
    for (let i in fromSeed.order) {
        hidden[i] = first[fromSeed.order[i]];
    }
    return hidden.join('');
}
WordsDeep.prototype.hiddenToHexStr = function (hidden, password) {
    var fromSeed = new FromSeed(this.defaultSymbols, password, hidden.length);
    var unordered = [];
    for (let i in fromSeed.unorder) {
        unordered[i] = hidden[fromSeed.unorder[i]];
    }
    unordered = unordered.join('');
    var hexStr = '';
    for (let i = 0; i < unordered.length; i++) {
        hexStr += fromSeed.undictGroup[i % 16][unordered[i]];
    }
    return hexStr;
}
WordsDeep.prototype.strToHexStr = function (str) {
    const code = encodeURIComponent(str);
    var hexStr = '';
    for (var i = 0; i < code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
            const hex = code.charAt(i + 1) + code.charAt(i + 2);
            hexStr += hex;
            i += 2;
        } else hexStr += (c.charCodeAt(0).toString(16));
    }
    return hexStr.toLowerCase();
}
WordsDeep.prototype.binStrToHexStr = function (binStr) {
    var hexStr = '';
    for (let i in binStr) {
        let hex = binStr.charCodeAt(i).toString(16);
        if (hex.length == 1) {
            hex = '0' + hex;
        }
        hexStr += hex;
    }
    return hexStr;
}
WordsDeep.prototype.hexStrToStr = function (hexStr) {
    var encoded = "";
    for (var i = 0; i < hexStr.length; i += 2) {
        encoded += '%' + hexStr[i] + hexStr[i + 1];
    }
    return decodeURIComponent(encoded);
}
WordsDeep.prototype.hexStrToBinStr = function (hexStr) {
    var binStr = '';
    for (let i = 0; i < hexStr.length; i += 2) {
        binStr += String.fromCharCode(parseInt(hexStr.slice(i, i + 2), 16));
    }
    return binStr;
}
WordsDeep.prototype.hideWithCompress = function (str, password) {
    var binStr = this.compress(str);
    var hexStr = this.binStrToHexStr(binStr);
    var hidden = this.hexStrToHidden(hexStr, password);
    return hidden;
}
WordsDeep.prototype.hideWithUtf8 = function (str, password) {
    var hexStr = this.strToHexStr(str);
    var hidden = this.hexStrToHidden(hexStr, password);
    return hidden;
}
WordsDeep.prototype.unhideWithCompress = function (hidden, password) {
    var hexStr = this.hiddenToHexStr(hidden, password);
    var binStr = this.hexStrToBinStr(hexStr);
    var str = this.uncompress(binStr);
    return str;
}
WordsDeep.prototype.unhideWithUtf8 = function (hidden, password) {
    var hexStr = this.hiddenToHexStr(hidden, password);
    var str = this.hexStrToStr(hexStr);
    return str;
}
WordsDeep.prototype.compress = function (str) {
    return pako.gzip(str, {
        to: 'string'
    });
}
WordsDeep.prototype.uncompress = function (binStr) {
    return pako.ungzip(binStr, {
        to: 'string'
    });
}

const invertKeyValues = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});

var wd = new WordsDeep();
$('.start-mixin').click(function () {
    console.time('process');
    var text = $('#textin').val();
    if ($('#if-encrypt')[0].checked) {
        var password = $('#password').val();
    } else {
        var password = '';
    }
    var back = $('#back-mode')[0].checked;
    var ifCompress = $('#if-compress')[0].checked;
    if (back) {
        let match = text.match(wd.symbolsReg);
        let hidden;
        if (match) {
            hidden = match[1];
        } else {
            M.toast({
                html: '未发现隐藏文本'
            });
            return;
        }
        try {
            if (ifCompress) {
                var str = wd.unhideWithCompress(hidden, password);
            } else {
                var str = wd.unhideWithUtf8(hidden, password);
            }
        } catch (e) {
            M.toast({
                html: "解密失败"
            });
            throw e;
        }
        text = text.replace(match[0], str);
    } else {
        if (ifCompress) {
            text = wd.hideWithCompress(text, password);
        } else {
            text = wd.hideWithUtf8(text, password);
        }
        text = '\u0020\u202d' + text + '\u202d\u0020';
    }
    $('pre.result').text(text);
    $('.to-copy').attr('data-clipboard-text', text);
    console.timeEnd('process');
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
