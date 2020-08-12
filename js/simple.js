var wordsAway = new WordsAway();
var wordsHide = new WordsHide();

//输出结果
function setText(text) {
    $('.process-result pre.result').text(text);
    $('.process-result .to-copy').attr('data-clipboard-text', text);
}

function setBackText(text) {
    $('.back-result pre.result').text(text);
    $('.back-result .to-copy').attr('data-clipboard-text', text);
}

//输出隐藏文本
function setHideText(text) {
    $('pre.hide-result').text(text);
    $('.hide-to-copy').attr('data-clipboard-text', text);
}

$('.start-mixin').click(function () { //处理
    if ($('#back-mode')[0].checked) {
        backMode();
        return;
    }
    var text = $('#textin').val();
    var mixin = '\u200b';
    var missUrl = $('#miss-url')[0].checked,
        coolapkMode = $('#coolapk-mode')[0].checked;
    var marked = '\ue0dc$1\ue0dd';
    //兼容链接
    text = (missUrl) ?
        text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=+]*)?)/g, marked) :
        text;
    //兼容 [表情] #话题# 和 @
    text = (coolapkMode) ?
        text.replace(/(#[\w\u4e00-\u9fa5\u3040-\u30ff]{1,20}?#)/g, marked)
        .replace(/(@[\w\u4e00-\u9fa5\u3040-\u30ff]{1,15} ?)/g, marked)
        .replace(/(\[[\w\u4e00-\u9fa5]{1,10}?\])/g, marked) :
        text;
    //每行双重反转
    text = ($('#rows-reverse')[0].checked) ?
        wordsAway.rowsReverse(text, true) :
        text;
    //每两字双重反转
    text = ($('#words-reverse')[0].checked) ?
        wordsAway.wordsReverse(text, true) :
        text;
    //零宽间隔
    text = ($('#zero-width-space')[0].checked) ?
        wordsAway.mixin(text, mixin, true) :
        text;
    //转为竖向排列
    text = ($('#vertical-text')[0].checked) ?
        wordsAway.verticalText(text, parseInt($('#max-col').val()), parseInt($('#min-row').val())) :
        text;
    //替换英文和数字
    text = ($('#letters-font')[0].checked) ?
        wordsAway.font(text, $('.font-selector')[0].value, true) :
        text;
    //去掉标记
    text = text.replace(/\ue0dc([^\s]+? ?)\ue0dd/g, '$1');
    
    text = text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=+]*)?)/g, ' $1 ');
    //隐藏文本
    if ($('#wordshide')[0].checked) {
        let toHide = $('#tohide-text').val();
        text += wordsHide.hideWithUtf8(toHide, '') + ' ';
    }

    if ($('#shorten-url')[0].checked) {
        //链接转短链接（API）
        var urls = text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=+]*)?)/g);
        $('pre.result').text('短链接请求中...');
        if (urls) {
            $(this).addClass('disabled');
        } else {
            setText(text);
        }
        for (let i in urls) {
            $.get('https://is.gd/create.php', {
                'url': urls[i],
                'format': 'json'
            }, (data) => {
                text = text.replace(urls[i], data['shorturl']);
                if (i == urls.length - 1) {
                    setText(text);
                    $(this).removeClass('disabled');
                }
            }, 'jsonp').fail(() => {
                M.toast({
                    html: '短链接请求失败'
                });
                setText(text);
                $(this).removeClass('disabled');
            });
        }
    } else {
        setText(text);
    }

});

function backMode() {
    var text = $('#back-textin').val();
    var match = text.match(wordsHide.SYMBOL_REG);
    if (match) {
        var hidden = match[0];
        try {
            var str = wordsHide.unhide(hidden, '');
        } catch (e) {
            M.toast({
                html: "隐藏文本解密失败"
            });
            console.log(e);
        }
        text = text.replace(match[0], '');
    }
    var marked = '\ue0dc$1\ue0dd';
    text = text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=+]*)?)/g, marked)
        .replace(/(#[\w\u4e00-\u9fa5\u3040-\u30ff]{1,20}?#)/g, marked)
        .replace(/(@[\w\u4e00-\u9fa5\u3040-\u30ff]{1,15} ?)/g, marked)
        .replace(/(\[[\w\u4e00-\u9fa5]{1,10}?\])/g, marked);
    text = wordsAway.back(text, true);
    setBackText(text);
    if (str !== undefined) {
        setHideText(str);
        $('div.hide-container').css('display', 'block');
    } else {
        setHideText('');
        $('div.hide-container').css('display', 'none');
    }

}

//CheckBox的点击事件
$('#miss-url').click(function () {
    if ($(this)[0].checked) {
        $('#shorten-url').removeAttr('disabled');
    } else {
        $('#shorten-url').attr('disabled', 'disabled')[0].checked = false;
    }
})
$('#miss-brackets').click(function () {
    if ($(this)[0].checked) {
        $('#vertical-text')[0].checked = false;
        $('#shorten-url').removeAttr('disabled');
    } else {
        $('#shorten-url').attr('disabled', 'disabled')[0].checked = false;
    }
});
$('#rows-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
});
$('#words-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse')[0].checked = false;
        $('#zero-width-space')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
});
$('#zero-width-space').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
});
$('#vertical-text').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#zero-width-space').attr('disabled', 'disabled')[0].checked = false;
        $('#words-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#miss-url').attr('disabled', 'disabled')[0].checked = false;
        $('#coolapk-mode').attr('disabled', 'disabled')[0].checked = false;
        $('#shorten-url').attr('disabled', 'disabled')[0].checked = false;
        $('.vertical-options').css('display', 'block');
    } else {
        $('#rows-reverse').removeAttr('disabled');
        $('#zero-width-space').removeAttr('disabled')[0].checked = true;
        $('#words-reverse').removeAttr('disabled');
        $('#miss-url').removeAttr('disabled')[0].checked = true;
        $('#coolapk-mode').removeAttr('disabled')[0].checked = true;
        $('#shorten-url').removeAttr('disabled');
        $('.vertical-options').css('display', 'none');
    }
});
$('#letters-font').click(function () {
    if ($(this)[0].checked) {
        $('.font-select-field').css('display', 'block');
    } else {
        $('.font-select-field').css('display', 'none');
    }
})

$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});

$().ready(function () {
    new ClipboardJS('.to-copy, .hide-to-copy');
    $('.font-selector').formSelect();
    $('.switch label').css('display', 'block');
})

$('#show-more-cb').click(function () {
    var more = $('.more-cb');
    if (more.css('display') == 'none') {
        more.css('display', 'block');
        $(this).text('隐藏更多选项');
    } else {
        more.css('display', 'none');
        $(this).text('显示更多选项');
    }
});

$('#back-mode').click(function () {
    if ($(this)[0].checked) {
        $('div.common-cb').css('display', 'none');
        $('div.more-cb > label').css('display', 'none');
        $('label.back-mode').css('display', 'block');
        $('div.process-fields').css('display', 'none');
        $('div.back-fields').css('display', 'block');
        $('div.back-result').css('display', 'block');
        $('div.process-result').css('display', 'none');
    } else {
        $('div.common-cb').css('display', 'block');
        $('div.more-cb > label').css('display', 'block');
        $('div.process-fields').css('display', 'block');
        $('div.back-fields').css('display', 'none');
        $('div.hide-container').css('display', 'none');
        $('div.back-result').css('display', 'none');
        $('div.process-result').css('display', 'block');
    }
});

$('#wordshide').click(function () {
    if ($(this)[0].checked) {
        $('.tohide-text').css('display', 'block');
    } else {
        $('.tohide-text').css('display', 'none');
    }
})
