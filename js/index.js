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
    text = (missBrackets) ?
        text.replace(/\[(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)\]/g, '$1') :
        text;
    text = ($('#zero-width-space')[0].checked) ?
        wordsAway.mixin(text, mixin, missBrackets) :
        text;
    text = ($('#vertical-text')[0].checked) ?
        wordsAway.verticalText(text, parseInt($('#max-col').val()), parseInt($('#min-row').val())) :
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

function Index() {
    this.landBgs = [
        'img/dark-PC-compressed/1.jpg',
        'img/dark-PC-compressed/2.jpg',
        'img/dark-PC-compressed/3.jpg',
        'img/dark-PC-compressed/4.jpg',
        'img/dark-PC-compressed/5.jpg',
        'img/dark-PC-compressed/6.jpg',
        'img/dark-PC-compressed/7.jpg',
        'img/dark-PC-compressed/8.jpg',
        'img/dark-PC-compressed/9.jpg',
        'img/dark-PC-compressed/10.jpg',
        'img/dark-PC-compressed/11.jpg',
        'img/dark-PC-compressed/12.jpg',
    ];
    this.portBgs = [
        'img/dark-mobile-compressed/0.jpg',
        'img/dark-mobile-compressed/1.jpg',
        'img/dark-mobile-compressed/2.jpg',
        'img/dark-mobile-compressed/3.jpg',
        'img/dark-mobile-compressed/4.jpg',
        'img/dark-mobile-compressed/5.jpg',
        'img/dark-mobile-compressed/6.jpg',
        'img/dark-mobile-compressed/7.jpg',
        'img/dark-mobile-compressed/8.jpg',
        'img/dark-mobile-compressed/9.jpg',
        'img/dark-mobile-compressed/10.jpg',
        'img/dark-mobile-compressed/11.jpg',
        'img/dark-mobile-compressed/12.jpg',
        'img/dark-mobile-compressed/13.jpg',
        'img/dark-mobile-compressed/14.jpg',
        'img/dark-mobile-compressed/a.jpg',
        'img/dark-mobile-compressed/b.jpg',
        'img/dark-mobile-compressed/c.jpg',
        'img/dark-mobile-compressed/d.jpg',
        'img/dark-mobile-compressed/e.jpg',
        'img/dark-mobile-compressed/f.jpg',
    ];
    var u = navigator.userAgent;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this.isFireFox = u.indexOf("Firefox") > -1;
    if (this.isiOS) {
        $('.main .background').css('transform', 'translate3d(0,0,0)')
            .css('height', '100%');
    }
}
Index.prototype.randint = function (obj) {
    return obj[Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]];
}
Index.prototype.setRandomBg = function () {
    var tag = $('.main .background');
    var bgs = (innerHeight > innerWidth) ?
        this.portBgs :
        this.landBgs;
    for (let i = 0; i < tag.length; i++) {
        let img = new Image();
        img.onload = function() {
            $(tag[i]).css('background-image', 'url(' + img.src +')');
        }
        img.src = this.randint(bgs);
    }
    !this.isFireFox && setTimeout(() => {this.setRandomBg()}, 30 * 1000);
}
$().ready(function () {
    var index = new Index();
    index.setRandomBg();
    new OneText('.one-text-a', {interval: 15, quote: true, libs: ['official', 'ext']})
});
