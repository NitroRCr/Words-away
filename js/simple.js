var wordsAway = new WordsAway();

$('.start-mixin').click(function () {
    var text = $('#textin').val();
    var mixin = '\u200b';
    var missBrackets = $('#miss-brackets')[0].checked;
    text = (missBrackets) ?
        text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g, '[$1]') :
        text;
    text = ($('#rows-reverse')[0].checked) ?
        wordsAway.turnOver(text, missBrackets) :
        text;
    text = ($('#words-reverse')[0].checked) ?
        wordsAway.wordsReverse(text, missBrackets) :
        text;
    text = ($('#zero-width-space')[0].checked) ?
        wordsAway.mixin(text, mixin, missBrackets) :
        text;
    text = ($('#vertical-text')[0].checked) ?
        wordsAway.verticalText(text, parseInt($('#max-col').val()), parseInt($('#min-row').val())) :
        text;
    text = (missBrackets) ?
        text.replace(/\[(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)\]/g, '$1') :
        text;
    text = ($('#fake-normal')[0].checked) ?
        wordsAway.sameShape(text) :
        text;
    $('pre.result').text(text);
    $('.to-copy').attr('data-clipboard-text', text);
})

$('#miss-brackets').click(function () {
    if ($(this)[0].checked) {
        $('#vertical-text')[0].checked = false;
    }
})
$('#rows-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
})
$('#words-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse')[0].checked = false;
        $('#zero-width-space')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
})
$('#zero-width-space').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
})
$('#vertical-text').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#zero-width-space').attr('disabled', 'disabled')[0].checked = false;
        $('#words-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#miss-brackets').attr('disabled', 'disabled')[0].checked = false;
        $('.input-field.hidden').css('display', 'inline-block');
    } else {
        $('#rows-reverse').removeAttr('disabled');
        $('#zero-width-space').removeAttr('disabled')[0].checked = true;
        $('#words-reverse').removeAttr('disabled');
        $('#miss-brackets').removeAttr('disabled')[0].checked = true;
        $('.input-field.hidden').css('display', 'none');
    }
})

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制<i class="c-huaji no-transform"></i>'
    });
})