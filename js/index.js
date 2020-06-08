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
    !this.isFireFox && !this.isiOS && setTimeout(() => {this.setRandomBg()}, 40 * 1000);
}
var index;
$().ready(function () {
    index = new Index();
    index.setRandomBg();
    new OneText('.one-text-a', {interval: 20, quote: true, libs: ['official', 'ext']})
});
