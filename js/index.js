function WordsAway() {}
WordsAway.prototype.mixin = function (text, mixin = '\u200b', missBrackets = true) {
    var result = '';
    var inBrackets = false;
    if (missBrackets) {
        for (let i in text) {
            let x = text[i];
            if (inBrackets) {
                result += x;
            } else {
                result += (mixin + x);
            }
            if (x == '[') {
                inBrackets = true;
            } else if (x == ']') {
                inBrackets = false;
            }
        }
    } else {
        for (let i in text) {
            result += (mixin + text[i]);
        }
    }
    return result;
}
WordsAway.prototype.turnOver = function (text, missBrackets = true) {
    var rows = text.split('\n');
    result = '';
    for (let i in rows) {
        inBrackets = false;
        let before;
        let x = rows[i];
        let newRow = '';
        for (let j in x) {
            let y = x[j];
            if (y == '[' && missBrackets) {
                before = j;
                inBrackets = true;
            } else if (y == ']' && missBrackets) {
                inBrackets = false;
                newRow = x.slice(before, parseInt(j) + 1) + newRow;
            } else if (!inBrackets) {
                newRow =
                    ((y == '(') ? ')' :
                        (y == ')') ? '(' :
                        (y == '（') ? '）' :
                        (y == '）') ? '（' :
                        (y == '{') ? '}' :
                        (y == '}') ? '{' :
                        (y == '《') ? '》' :
                        (y == '》') ? '《' :
                        (y == '<') ? '>' :
                        (y == '>') ? '<' :
                        (y == '【') ? '】' :
                        (y == '】') ? '【' :
                        y) +
                    newRow;
            }
        }
        newRow = '\u202e' + newRow + '\n';
        result += newRow;
    }
    return result;
}

var wordsAway = new WordsAway();

$('.start-mixin').click(function () {
    var text = $('#textin').val();
    var mixin = '\u200b';
    var missBrackets = $('#miss-brackets')[0].checked;
    text = (missBrackets) ? text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g, '[$1]') : text;
    text = wordsAway.mixin(text, mixin, missBrackets);
    text = ($('#twice-turn-over')[0].checked) ? wordsAway.turnOver(text, missBrackets) : text;
    text = (missBrackets) ? text.replace(/\[(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)\]/g, '$1') : text;
    $('pre.result').text(text);
    $('.to-copy').attr('data-clipboard-text', text);
})

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制<i class="c-huaji no-transform"></i>'
    });
})
