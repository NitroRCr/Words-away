# Words-away  
## 这个东西是干什么的？
一个文本处理工具，用于防止对文本的敏感词检测。主要是因为酷安的折叠词太过蜜汁，**例如“申诉”也会被折叠（doge）**
所以就有了这个软件。
## 原理：
+ 普通模式：在相隔的两个字符之间插入Unicode间隔符（[U+200B](https://unicode.org/cldr/utility/character.jsp?a=200B))以规避检测。
+ （可选）增强的双重反转模式：将一行内所有文字顺序反转（物理）再加入Unicode反转控制符([U+202E](https://unicode.org/cldr/utility/character.jsp?a=202E))从而实现增强的规避检测。
+ （可选）（默认选中）规避中括号：遇到中括号时不进行反转，以避免表情符号出现Bug。
## 隐私：
基于JavaScript的网页实现，不会将数据传到服务器~可以放心使用
## 已实现的功能：
+ [x] 增强模式
+ [ ] 自动判断链接并绕行
+ [ ] ？
## 使用：
+ 可以在[Release页面](https://github.com)（暂未发布）下载最新的本地部署版本，可以部署到服务器或离线使用。
+ 可以使用 [在线demo](https://blog.texice.xyz/demo/textmix)
>对了，这个项目本来就是无聊开发的
>可以查阅[作者的酷安主页](http://www.coolapk.com/u/1362352)
>以及[作者的Github主页](https://github.com/NitroRCr)
>>
usage懒得写了。。。你写吧
