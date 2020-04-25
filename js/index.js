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
                newRow = y + newRow;
            }
        }
        if (inBrackets && missBrackets) {
            inBrackets = false;
            newRow = x.slice(before, x.length + 1) + newRow;
        }
        newRow = '\u202e' + newRow + '\n';
        result += newRow;
    }
    return this.toggleBrackets(result);
}
WordsAway.prototype.wordsReverse = function (text, missBrackets = true) {
    var rows = text.split('\n');
    var result = '';
    for (let i in rows) {
        let inBrackets = false;
        let x = rows[i];
        let before;
        let newRow = '';
        for (let j = 0; j < x.length; j += 3) {
            let y = x.slice(j, j + 3);
            let hasBrackets = false;
            if (y.indexOf('[') != -1 && missBrackets) {
                inBrackets = true;
                hasBrackets = true;
            }
            if (y.indexOf(']') != -1 && missBrackets) {
                inBrackets = false;
                hasBrackets = true;
            }
            if (inBrackets | hasBrackets) {
                newRow += y;
            } else {
                newRow += '\u200e' + x[j] + '\u202e' +
                    ((x[j + 2] !== undefined) ? this.toggleBracketsChar(x[j + 2]) : '') +
                    ((x[j + 1] !== undefined) ? this.toggleBracketsChar(x[j + 1]) : '') +
                    '\u202c';
            }
        }
        result += newRow + '\n';
    }
    return result;
}
WordsAway.prototype.toggleBrackets = function (text) {
    result = '';
    for (let i in text) {
        result += this.toggleBracketsChar(text[i]);
    }
    return result;
}
WordsAway.prototype.toggleBracketsChar = function (char) {
    return (char == '(') ? ')' :
        (char == ')') ? '(' :
        (char == '（') ? '）' :
        (char == '）') ? '（' :
        (char == '{') ? '}' :
        (char == '}') ? '{' :
        (char == '《') ? '》' :
        (char == '》') ? '《' :
        (char == '<') ? '>' :
        (char == '>') ? '<' :
        (char == '【') ? '】' :
        (char == '】') ? '【' :
        char;
}
WordsAway.prototype.verticalText = function (text, maxCol = 12, minHeight = 10) {
    text = text.replace(/[\n\r]/g, '');
    console.log(text);
    var rowNum = Math.ceil(Math.max(text.length / maxCol, minHeight));
    var rows = [];
    for (let i = 0; i < rowNum; i++) {
        rows[i] = '';
    }
    for (let i in text) {
        rows[i % rowNum] += text[i] + ' ';
    }
    result = '';
    for (let i in rows) {
        result += rows[i] + '\n';
    }
    return result;
}

var wordsAway = new WordsAway();

$('.start-mixin').click(function () {
    var text = $('#textin').val();
    var mixin = '\u200b';
    var missBrackets = $('#miss-brackets')[0].checked;
    text = (missBrackets) ?
        text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g, '[$1]') :
        text;
    text = ($('#rows-reverse')[0].checked) ?
        wordsAway.turnOver(text, missBrackets) :
        text;
    text = ($('#words-reverse')[0].checked) ?
        wordsAway.wordsReverse(text, missBrackets) :
        text;
    text = (missBrackets) ?
        text.replace(/\[(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)\]/g, '$1') :
        text;
    text = ($('#zero-width-space')[0].checked) ?
        wordsAway.mixin(text, mixin, missBrackets) :
        text;
    text = ($('#vertical-text')[0].checked) ?
        wordsAway.verticalText(text) :
        text;
    $('pre.result').text(text);
    $('.to-copy').attr('data-clipboard-text', text);
})

$('#miss-brackets').click(function () {
    if ($(this)[0].checked) {
        $('#vertical-text')[0].checked = false;
    }
})
$('#rows-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
})
$('#words-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse')[0].checked = false;
        $('#zero-width-space')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
})
$('#zero-width-space').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
})
$('#vertical-text').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#zero-width-space').attr('disabled', 'disabled')[0].checked = false;
        $('#words-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#miss-brackets').attr('disabled', 'disabled')[0].checked = false;
    } else {
        $('#rows-reverse').removeAttr('disabled');
        $('#zero-width-space').removeAttr('disabled')[0].checked = true;
        $('#words-reverse').removeAttr('disabled');
        $('#miss-brackets').removeAttr('disabled')[0].checked = true;
    }
})

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制<i class="c-huaji no-transform"></i>'
    });
})
