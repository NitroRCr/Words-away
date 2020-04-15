$('.start-mixin').click(function () {
    console.time();
    var text = $('#textin').val();
    var mixin = '\u200b';
    var result = '';
    var inBrackets = false;
    var missBrackets = $('#miss-brackets')[0].checked;
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
    if ($('#twice-turn-over')[0].checked) {
        var rows = result.split('\n');
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
    }
    $('pre.result').text(result);
    $('.to-copy').attr('data-clipboard-text', result);
    console.timeEnd();
})
new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制<i class="c-huaji no-transform"></i>'
    });
})
