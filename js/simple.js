var wordsAway = new WordsAway();

$('.start-mixin').click(function () {
    var text = $('#textin').val();
    var mixin = '\u200b';
    var beforeMark = '\ue0dc',
        afterMark = '\ue0dd';
    var missUrl = $('#miss-url')[0].checked,
        coolapkMode = $('#coolapk-mode')[0].checked;
    var marked = '\ue0dc$1\ue0dd';
    text = (missUrl) ?
        text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?)/g, marked) :
        text;
    text = (coolapkMode) ?
        text.replace(/(#[\w\u4e00-\u9fa5\u3040-\u30ff]{1,20}?#)/g, marked)
        .replace(/(@[\w\u4e00-\u9fa5\u3040-\u30ff]{1,15} ?)/g, marked) :
        text;
    text = ($('#rows-reverse')[0].checked) ?
        wordsAway.rowsReverse(text, true) :
        text;
    text = ($('#words-reverse')[0].checked) ?
        wordsAway.wordsReverse(text, true) :
        text;
    text = ($('#zero-width-space')[0].checked) ?
        wordsAway.mixin(text, mixin, true) :
        text;
    text = ($('#vertical-text')[0].checked) ?
        wordsAway.verticalText(text, parseInt($('#max-col').val()), parseInt($('#min-row').val())) :
        text;
    text = ($('#letters-font')[0].checked) ?
        wordsAway.font(text, $('.font-selector')[0].value, true) :
        text;
    text = text.replace(/\ue0dc([^\s]+? ?)\ue0dd/g, '$1');

    var setText = () => {
        $('pre.result').text(text);
        $('.to-copy').attr('data-clipboard-text', text);
    }

    if ($('#shorten-url')[0].checked) {
        var urls = text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g);
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
                M.toast('短链接请求失败');
                setText();
            });
        }
    } else {
        setText();
    }
});

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