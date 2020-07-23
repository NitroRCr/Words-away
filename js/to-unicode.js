$('.start-mixin').click(function () {
    var text = $('#textin').val();
    if ($('#if-filter')[0].checked) {
        var filter = $('#filter').val();
    } else {
        var filter = false;
    }
    var result = string2unicode(text, $('#mode2')[0].checked, filter);
    $('pre.result').text(result);
    $('.to-copy').attr('data-clipboard-text', result);
})

function string2unicode(text, mode2 = false, filter) {
    var result = '';
    if (filter) {
        var reg = new RegExp('[' + filter + ']');
    }
    if (mode2) {
        var list = Array.from(text);
        for (let i of list) {
            if (filter && reg.test(i)) {
                result += i;
            } else {
                result += ustr(i.codePointAt(0));
            }
        }
    } else {
        for (let i in text) {
            if (filter && reg.test(text[i])) {
                result += text[i];
            } else {
                result += ustr(text.charCodeAt(i));
            }
        }
    }
    return result;
}

function ustr(code) {
    var code16 = code.toString(16);
    if (code < 0xf) {
        return "\\u" + "000" + code16;
    } else if (code <= 0xff) {
        return "\\u" + "00" + code16;
    } else if (code <= 0xfff) {
        return "\\u" + "0" + code16;
    } else if (code <= 0xffff) {
        return "\\u" + code16;
    } else {
        return "\\u{" + code16 + "}";
    }
}

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});

$('#if-filter').click(function() {
    if($(this)[0].checked) {
        $('div.filter').css('display', 'block');
    } else {
        $('div.filter').css('display', 'none');
    }
})
