$('.start-mixin').click(function () {
    var text = $('#textin').val();
    var result = ($('#back-mode')[0].checked) ?
        unhide(text, dict) :
        hide(text, dict);
    result = ' ' + result + ' ';
    $('pre.result').text(result);
    $('.to-copy').attr('data-clipboard-text', result);
})

var dict = {
    '0': '\u200b',
    '1': '\u200c',
    '2': '\u200d',
    '3': '\u200e',
    '4': '\u200f',
    '5': '\u202a',
    '6': '\u202b',
    '7': '\u202c',
    '8': '\u202d',
    '9': '\u202e',
    'a': '\u2060',
    'b': '\u2061',
    'c': '\u2062',
    'd': '\u2063',
    'e': '\u2064',
    'f': '\u2065',
    'mark': '\u2066'
}
const invertKeyValues = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key;
    return acc;
  }, {});
function hide(text, dict) {
    var result = '';
    for (let i in text) {
        result += dict["mark"];
        let code16 = text.charCodeAt(i).toString(16);
        for (let j of code16) {
            result += dict[j];
        }
    }
    return result;
}

function unhide(text, dict) {
    var undict = invertKeyValues(dict);
    var result = '';
    for (var i = 0; i < text.length;) {
        if (text[i] == dict['mark']) {
            let char = '';
            while (text[++i] && text[i] != dict['mark']) {
                char += undict[text[i]];
            }
            result += String.fromCharCode(parseInt(char, 16));
        } else {
            result += text[i++];
        }
    }
    return result
}

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});
