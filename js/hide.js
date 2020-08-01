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
}
WordsDeep.prototype.getDict = function (seed) {
    var random = new Math.seedrandom(seed);
    var symbols = this.defaultSymbols;
    var count = 16;
    var shuffled = symbols.slice(0),
        i = symbols.length,
        min = i - count,
        temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    var array = shuffled.slice(min);
    var dict = {}
    for (let i = 0; i < count; i++) {
        dict[i.toString(16)] = array[i];
    }
    return dict;
}
WordsDeep.prototype.hide = function (text, password) {
    var dict = this.getDict(password);
    var mark = '\u202d';
    var result = '';
    for (let i in text) {
        result += mark;
        let code16 = text.charCodeAt(i).toString(16);
        for (let j of code16) {
            result += dict[j];
        }
    }
    return result;
}
WordsDeep.prototype.unhide = function (text, password) {
    var undict = this.invertKeyValues(this.getDict(password));
    var mark = '\u202d';
    var result = '';
    for (var i = 0; i < text.length;) {
        if (text[i] == mark) {
            let char = '';
            while (text[++i] && text[i] != mark) {
                char += undict[text[i]];
            }
            result += String.fromCharCode(parseInt(char, 16));
        } else {
            result += text[i++];
        }
    }
    return result
}
WordsDeep.prototype.invertKeyValues = obj =>
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

var wordsDeep = new WordsDeep();
$('.start-mixin').click(function () {
    var text = $('#textin').val();
    if ($('#if-encrypt')[0].checked) {
        var password = $('#password').val();
    } else {
        var password = '';
    }
    var result = ($('#back-mode')[0].checked) ?
        wordsDeep.unhide(text, password) :
        wordsDeep.hide(text, password);
    result = ' ' + result + ' ';
    $('pre.result').text(result);
    $('.to-copy').attr('data-clipboard-text', result);
});

$('#if-encrypt').click(function() {
    if($(this)[0].checked) {
        $('div.password').css('display', 'block');
    } else {
        $('div.password').css('display', 'none');
    }
});
