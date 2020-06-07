function WordsAway() {}
WordsAway.prototype.mixin = function (text, mixin = '\u200b', missBrackets = true) {
    return this.stringListed(text, missBrackets).join(mixin);
}
WordsAway.prototype.rowsReverse = function (text, missBrackets = true) {
    var rows = text.split('\n');
    var result = '';
    for (let i = 0; i < rows.length; i++) {
        result += '\u202e' + this.stringListed(rows[i], missBrackets).reverse().join('');
        if (i < rows.length - 1) {
            result += '\n';
        }
    }
    return this.toggleBrackets(result, missBrackets);
}
WordsAway.prototype.wordsReverse = function (text, missBrackets = true) {
    var rows = text.split('\n');
    var result = '';
    for (let i = 0; i < rows.length; i++) {
        let list = this.stringListed(rows[i]);
        for (let j = 0; j < list.length; j += 3) {
            let first = list[j];
            let second = (list[j + 1] !== undefined) ?
                this.toggleBracketsChar(list[j + 1]) :
                '';
            let third = (list[j + 2] !== undefined) ?
                this.toggleBracketsChar(list[j + 2]) :
                '';
            result += ('\u200e' + first + '\u202e' + third + second + '\u202c');
        }
        if (i < rows.length - 1) {
            result += '\n';
        }
    }
    return result;
}
WordsAway.prototype.toggleBrackets = function (text, brackets) {
    var list = this.stringListed(text, brackets);
    result = '';
    for (let i in list) {
        result += this.toggleBracketsChar(list[i]);
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
    text = Array.from(text);
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
WordsAway.prototype.sameShape = function (text, brackets) {
    var styles = {
        'normal': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        //实际有效：асԁеցһіјӏոорԛѕսԝхуАВСЕНІЈКМОРԚЅΤՍԜХΥΖ
        'fake-normal': 'аbсԁеfցһіјkӏmոорԛrѕtսvԝхуzАВСDЕFGНІЈКLМNОРԚRЅΤՍVԜХΥΖ',
    }
    return this.replaceAll(text, styles['normal'], styles['fake-normal'], brackets);
}
WordsAway.prototype.replaceAll = function (text, from, to, brackets) {
    if (from.length != to.length) {
        console.log('`from` and `to`, length are not the same!');
    }
    var result = '';
    var list = this.stringListed(text, brackets);
    for (let i of list) {
        let found = false;
        for (let j in from) {
            if (i == from[j]) {
                result += to[j];
                found = true;
            }
        }
        if (!found) {
            result += i;
        }
    }
    return result;
}
WordsAway.prototype.stringListed = function (text, brackets = true) {
    var list = Array.from(text);
    var result = [];
    if (brackets) {
        var inBrackets = false;
        var before = 0;
        for (let i = 0; i < list.length; i++) {
            let x = list[i];
            if (x == '[') {
                if (inBrackets) {
                    result.concat(list.slice(before, i));
                } else {
                    inBrackets = true;
                    before = i;
                }
            } else if (x == ']' && inBrackets) {
                inBrackets = false;
                result.push(list.slice(before, i + 1).join(''));
                console.log(i + 1);
                console.log(list.slice(before, i + 1));
            } else if (!inBrackets) {
                result.push(x);
            }
        }
        if (inBrackets) {
            result.concat(list.slice(before, list.length));
        }
    } else {
        result = list;
    }
    return result
}
