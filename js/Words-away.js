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
            result += ('\u200e' + first + '\u202e' + third + '\u200b' + second + '\u202c');
        }
        if (i < rows.length - 1) {
            result += '\n';
        }
    }
    return result;
}
WordsAway.prototype.toggleBrackets = function (text, marks) {
    var list = this.stringListed(text, marks);
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
        (char == '[') ? ']' :
        (char == ']') ? '[' :
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
WordsAway.prototype.font = function (text, style, marks = true) {
    for (let i in this.styles) {
        if (this.styles[i][style] === undefined) {
            continue;
        }
        text = this.replaceAll(text, this.styles[i]['normal'], this.styles[i][style], marks);
    }
    return text;
}
WordsAway.prototype.replaceAll = function (text, from, to, marks) {
    if (from.length != to.length) {
        console.log('`from` and `to`, length are not the same!');
    }
    var result = '';
    var list = this.stringListed(text, marks);
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
WordsAway.prototype.stringListed = function (text,
    marks = true,
    beforeMark = '\ue0dc',
    afterMark = '\ue0dd') {
    var list = Array.from(text);
    var result = [];
    if (marks) {
        var inMarks = false;
        var before = 0;
        for (let i = 0; i < list.length; i++) {
            let x = list[i];
            if (x == beforeMark) {
                if (inMarks) {
                    result.concat(list.slice(before, i));
                } else {
                    inMarks = true;
                    before = i;
                }
            } else if (x == afterMark && inMarks) {
                inMarks = false;
                result.push(list.slice(before, i + 1).join(''));
            } else if (!inMarks) {
                result.push(x);
            }
        }
        if (inMarks) {
            result.concat(list.slice(before, list.length));
        }
    } else {
        result = list;
    }
    return result
}
WordsAway.prototype.styles = {
    letters: {
        'normal': Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        'bold': Array.from('𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙'),
        'italic': Array.from('𝑎𝑏𝑐𝑑𝑒𝑓𝑔𝑕𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍'),
        'monospace': Array.from('𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'),
        'script': Array.from('𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'),
        'bold-italic': Array.from('𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁'),
        'bold-script': Array.from('𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩'),
        'double-struck': Array.from('𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'),
        'sans-serif': Array.from('𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹'),
        'sans-serif-bold': Array.from('𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'),
        'sans-serif-italic': Array.from('𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'),
        'sans-serif-bold-italic': Array.from('𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕'),
        'reverse': Array.from('ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎzⱯꓭƆꓷꓱℲꓨHIꓩꞰꓶꟽNOꓒQꓤSꞱꓵɅMX⅄Z'),
        //实际有效：асԁеցһіјӏոорԛѕսԝхуАВСЕНІЈКМОРԚЅΤՍԜХΥΖ
        'fake-normal': Array.from('аbсԁеfցһіјkӏmոорԛrѕtսvԝхуzАВСDЕFGНІЈКLМNОРԚRЅΤՍVԜХΥΖ'),
    },
    numbers: {
        'normal': Array.from('0123456789'),
        'bold': Array.from('𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'),
        'monospace': Array.from('𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'),
        'sans-serif': Array.from('𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫'),
        'double-struck': Array.from('𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'),
        'sans-serif-bold': Array.from('𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'),
    },
    marks: {
        'normal': ['\\?', '\\.', ',', '!', '\\&', '"'],
        'reverse': ['¿', '˙', "'", '¡', '⅋', ',,'],
    },
}
WordsAway.prototype.back = function (text, marks) {
    text = text.replace(/[\u200b\u200e]/g, '');
    var reverseds = text.match(/\u202e(.*?)\u202c?(?<=\u202c).*$/gm);
    if (!reverseds) {
        return text;
    }
    for (let i of reverseds) {
        let match = i.match(/\u202e(.*?)\u202c?(?<=\u202c).*$/m);
        let last = (/\u202c/.test(i)) ?
            '' :
            '\n';
        text = text.replace(i, this.toggleBrackets(this.stringListed(match[1], marks).reverse().join(''), marks) + last);
    }
    return text;
}
