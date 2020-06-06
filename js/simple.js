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
    if ($('#shorten-url')[0].checked) {
        var urls = text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g);
        for (let i in urls) {
            /*$.get('http://sho.rt/yourls-api.php', {
                    username: "your_username",
                    password: "your_password",
                    action: "shorturl",
                    format: "jsonp",
                    url: urls[i]
                },
                (data) => {
                    console.log(data);
                    var json = JSON.parse(data);
                    var url = json['url']['url'];
                    text = text.replace(urls[i], url);
                    if (i == url.length - 1) {
                        $('pre.result').text(text);
                        $('.to-copy').attr('data-clipboard-text', text);
                    }
                }
            );*/
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "/api/shortenurl/get?via=via&type=type&custom=" + Math.random().toString(36).slice(-4) + "&private=1&password=password&uses=100&url=" + encodeURIComponent(urls[i]),
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "free-url-shortener.p.rapidapi.com",
                    "x-rapidapi-key": "371c5214f2msh8192485aef7f824p176391jsn68ba5f579482",
                    "password": "",
                    "custom": '',
                    "url": urls[i],
                    "private": ""
                }
            }
            console.log(settings.url);
            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        }
    } else {
        $('pre.result').text(text);
        $('.to-copy').attr('data-clipboard-text', text);
    }
});

$('#miss-brackets').click(function () {
    if ($(this)[0].checked) {
        $('#vertical-text')[0].checked = false;
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
        $('#miss-brackets').attr('disabled', 'disabled')[0].checked = false;
        $('.input-field.hidden').css('display', 'inline-block');
    } else {
        $('#rows-reverse').removeAttr('disabled');
        $('#zero-width-space').removeAttr('disabled')[0].checked = true;
        $('#words-reverse').removeAttr('disabled');
        $('#miss-brackets').removeAttr('disabled')[0].checked = true;
        $('.input-field.hidden').css('display', 'none');
    }
});

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});
