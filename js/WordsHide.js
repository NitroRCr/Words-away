function WordsHide() {
    this.defaultSymbols = [
        '\u200b',
        '\u200c',
        '\u200d',
        '\u200e',
        '\u200f',
        '\u202a',
        '\u202b',
        '\u202c',
        '\u202e',
        '\u2060',
        '\u2061',
        '\u2062',
        '\u2063',
        '\u2064',
        '\u2065',
        '\u2066',
        '\u2068',
        '\u2069',
        '\u206a',
        '\u206b',
        '\u206c',
        '\u206d',
        '\u206e',
        '\u206f'
    ];
    this.symbolsReg = /\u202d([\u200b-\u200f\u202a-\u202c\u202e\u2060-\u206f]+)\u202d/;
}
WordsHide.prototype.hexStrToHidden = function (hexStr, password) {
    var fromSeed = new FromSeed(this.defaultSymbols, password, hexStr.length);
    var first = '';
    for (let i in hexStr) {
        first += fromSeed.dictGroup[i % 16][hexStr[i]];
    }
    var hidden = [];
    for (let i in fromSeed.order) {
        hidden[i] = first[fromSeed.order[i]];
    }
    return hidden.join('');
}
WordsHide.prototype.hiddenToHexStr = function (hidden, password) {
    var fromSeed = new FromSeed(this.defaultSymbols, password, hidden.length);
    var unordered = [];
    for (let i in fromSeed.unorder) {
        unordered[i] = hidden[fromSeed.unorder[i]];
    }
    unordered = unordered.join('');
    var hexStr = '';
    for (let i = 0; i < unordered.length; i++) {
        hexStr += fromSeed.undictGroup[i % 16][unordered[i]];
    }
    return hexStr;
}
WordsHide.prototype.strToHexStr = function (str) {
    const code = encodeURIComponent(str);
    var hexStr = '';
    for (var i = 0; i < code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
            const hex = code.charAt(i + 1) + code.charAt(i + 2);
            hexStr += hex;
            i += 2;
        } else hexStr += (c.charCodeAt(0).toString(16));
    }
    return hexStr.toLowerCase();
}
WordsHide.prototype.binStrToHexStr = function (binStr) {
    var hexStr = '';
    for (let i in binStr) {
        let hex = binStr.charCodeAt(i).toString(16);
        if (hex.length == 1) {
            hex = '0' + hex;
        }
        hexStr += hex;
    }
    return hexStr;
}
WordsHide.prototype.hexStrToStr = function (hexStr) {
    var encoded = "";
    for (var i = 0; i < hexStr.length; i += 2) {
        encoded += '%' + hexStr[i] + hexStr[i + 1];
    }
    return decodeURIComponent(encoded);
}
WordsHide.prototype.hexStrToBinStr = function (hexStr) {
    var binStr = '';
    for (let i = 0; i < hexStr.length; i += 2) {
        binStr += String.fromCharCode(parseInt(hexStr.slice(i, i + 2), 16));
    }
    return binStr;
}
WordsHide.prototype.hideWithCompress = function (str, password = "") {
    var binStr = this.compress(str);
    var hexStr = this.binStrToHexStr(binStr);
    var hidden = this.hexStrToHidden(hexStr, password);
    return hidden;
}
WordsHide.prototype.hideWithUtf8 = function (str, password = "") {
    var hexStr = this.strToHexStr(str);
    var hidden = this.hexStrToHidden(hexStr, password);
    return hidden;
}
WordsHide.prototype.unhideWithCompress = function (hidden, password = "") {
    var hexStr = this.hiddenToHexStr(hidden, password);
    var binStr = this.hexStrToBinStr(hexStr);
    var str = this.uncompress(binStr);
    return str;
}
WordsHide.prototype.unhideWithUtf8 = function (hidden, password = "") {
    var hexStr = this.hiddenToHexStr(hidden, password);
    var str = this.hexStrToStr(hexStr);
    return str;
}
WordsHide.prototype.compress = function (str) {
    return pako.gzip(str, {
        to: 'string'
    });
}
WordsHide.prototype.uncompress = function (binStr) {
    return pako.ungzip(binStr, {
        to: 'string'
    });
}
function FromSeed(symbols, seed, length) {
    this.symbols = symbols;
    this.seed = seed;
    this.length = length;
    this.random = new Math.seedrandom(seed);
    this.dictGroup = this.getDictGroup();
    this.undictGroup = this.getUndictGroup();
    this.order = this.getOrder();
    this.unorder = this.getUnorder();
}
FromSeed.prototype.fakeShuffle = function (arr, random) {
    var length = arr.length,
        temp,
        random_;
    while (0 != length) {
        random_ = Math.floor(random() * length);
        length--;
        temp = arr[length];
        arr[length] = arr[random_];
        arr[random_] = temp;
    }
    return arr;
}
FromSeed.prototype.getDict = function () {
    var arr = this.fakeShuffle(Array.from(this.symbols), this.random).slice(0, 16);
    var dict = {};
    for (let i = 0; i < arr.length; i++) {
        dict[i.toString(16)] = arr[i];
    }
    return dict;
}
FromSeed.prototype.getDictGroup = function () {
    var dictGroup = [];
    for (let i = 0; i < 16; i++) {
        let dict = this.getDict();
        dictGroup[i] = dict;
    }
    return dictGroup;
}
FromSeed.prototype.getUndictGroup = function () {
    var undictGroup = [];
    for (let i = 0; i < 16; i++) {
        let undict = invertKeyValues(this.dictGroup[i])
        undictGroup.push(undict);
    }
    return undictGroup;
}
FromSeed.prototype.getOrder = function () {
    var order = {};
    var arr = [];
    for (let i = 0; i < this.length; i++) {
        arr.push(i);
    }
    arr = this.fakeShuffle(arr, this.random);
    for (let i = 0; i < this.length; i++) {
        order[i] = arr[i];
    }
    return order;
}
FromSeed.prototype.getUnorder = function () {
    return invertKeyValues(this.order);
}



const invertKeyValues = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});
