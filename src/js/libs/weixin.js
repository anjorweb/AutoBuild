var isComplete=0;
var _isajaxing = 0;
var wxDefault = {
    title:"来自瑞士的又一份礼物",
    desc:"Pingo品酷，给宝宝贴“芯”呵护。转动转盘还有机会赢取纸尿裤，还等什么快来加入我们吧~",
    imgUrl:"http://pinco.yescia.com/h5/newgift/images/120.jpg",
    link:location.href,
    success:function(){
		trackEvent('share_message');
    },successtl:function(){
		trackEvent('share_timeline');
    }
};
function wxShare(data){
    var newData = $.extend({},wxDefault, data);
    wx.onMenuShareAppMessage(newData);
    wx.onMenuShareQQ(newData);
    wx.onMenuShareWeibo(newData);
    wx.onMenuShareTimeline({
        title:newData.desc,
        imgUrl:newData.imgUrl,
        link:newData.link,
        success: newData.successtl
    });
}
$(function(){
    var pageUrl = location.href;
    $.ajax({
        url:"http://wxrouter.yescia.com/Api/wxJsConfig/appid/wx12954adb3e7f0cc2.html",
        dataType:"jsonp",
        jsonp:"jsoncallback",
        data:{url:encodeURIComponent(pageUrl)},
        success:function(data){
            data.debug = false;
            wx.config(data);
            wx.ready(function(){
                wxShare();
            });
        }
    })
});












