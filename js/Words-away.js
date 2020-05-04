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
    text = text.replace(/[\n\r\s]/g, '');
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