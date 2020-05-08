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
WordsAway.prototype.unicodeStyle = function() {
    
}
WordsAway.prototype.letters = {
    0: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    bold: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
    monospace: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
    script: '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
    boldItalic: '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
    boldScript: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
    doubleStruck: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
    sansSerifBold: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
    sansSerifItalic: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
    sansSerifBoldItalic: '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
    
}
WordsAway.prototype.numbers = {
    0: '0123456789',
    bold: '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
    monospace: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
    sansSerif: '𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫',
    doubleStruck: '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
    sansSerifBold: '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
}
