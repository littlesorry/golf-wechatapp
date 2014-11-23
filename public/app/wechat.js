(function() {
	var ns = Q.use("rolling");

	var wechat = ns.wechat = {};

    var imgUrl = "http://wxkf.gofaner.com:9000/assets/icon.png";
    var shareLink = "http://wxkf.gofaner.com:9000/enter/";

	var descContent = "";

    WeixinApi.ready(function(Api) {
        Api.showOptionMenu();

        var wxData = {
            "appId": "",
            "imgUrl" : imgUrl,
            "link" : shareLink + "?referId=" + encodeURIComponent(ns.game.params.openId),
            "desc" : descContent,
            "title" : ""
        };
        
        var callbacks = {
            ready : function() {
            },
            cancel : function(resp) {
            },
            fail : function(resp) {
            },
            confirm : function(resp) {
            	if (ns.game.state === 'do_share') {
            		ns.game.state = 'complete';
            	}
            },
            all : function(resp,shareTo) {
            }
        };

        // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
        Api.shareToFriend(wxData, callbacks);
        // 点击分享到朋友圈，会执行下面这个代码
        Api.shareToTimeline(wxData, callbacks);
        // 点击分享到腾讯微博，会执行下面这个代码
        Api.shareToWeibo(wxData, callbacks);
        // iOS上，可以直接调用这个API进行分享，一句话搞定
        Api.generalShare(wxData,callbacks);
    });
})();