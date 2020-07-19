var wordsAway = new WordsAway();

$('.start-mixin').click(function () {   //处理
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
    //输出结果的函数
    var setText = () => {
        $('pre.result').text(text);
        $('.to-copy').attr('data-clipboard-text', text);
    }
    if ($('#shorten-url')[0].checked) {
        //链接转短链接（API）
        var urls = text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=+]*)?)/g);
        $('pre.result').text('短链接请求中...');
        if (urls) {
            $(this).addClass('disabled');
        } else {
            setText();
        }
        for (let i in urls) {
            $.get('https://is.gd/create.php', {
                'url': urls[i],
                'format': 'json'
            }, (data) => {
                text = text.replace(urls[i], data['shorturl']);
                if (i == urls.length - 1) {
                    setText();
                    $(this).removeClass('disabled');
                }
            }, 'jsonp').fail(() => {
                M.toast({html: '短链接请求失败'});
                setText();
                $(this).removeClass('disabled');
            });
        }
    } else {
        setText();
    }
});

//CheckBox的点击事件
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
$('#letters-font').click(function() {
    if ($(this)[0].checked) {
        $('.font-select-field').css('display', 'block');
    } else {
        $('.font-select-field').css('display', 'none');
    }
})

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});

$().ready(function() {
    $('.font-selector').formSelect();
})