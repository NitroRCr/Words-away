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
    var result = '';
    for (let i in rows) {
        let inBrackets = false;
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
        if (inBrackets && missBrackets) {
            inBrackets = false;
            newRow = x.slice(before, x.length + 1) + newRow;
        }
        newRow = '\u202e' + newRow + '\n';
        result += newRow;
    }
    return result;
}
WordsAway.prototype.wordsReverse = function(text, missBrackets = true) {
    var rows = text.split('\n');
    var result = '';
    for (let i in rows) {
        let inBrackets = false;
        let x = rows[i];
        let before;
        let newRow = '';
        for (let j = 0; j < x.length; j += 3) {
            for (let k = j; k < j + 3, k++) {
                let z = x[k];
                if (z == '[' && missBrackets) {
                    before = k;
                    inBrackets = true;
                } else if (z == ']' && missBrackets) {
                    newRow += y.slice(before, k);
                    inBrackets = false;
                }
            }
            if (!inBrackets) {
                newRow += x[j] + '\u202e' + x.slice(j+1, j+3) + '\u202c';
            }
        }
    }
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
