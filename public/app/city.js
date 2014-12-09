(function () {
	var ns = Q.use("bag");

	var states = ["北京"
				,"福建"
				,"江苏"
				,"辽宁"
				,"山东"
				,"陕西"
				,"天津"
				,"新疆"
				,"浙江"
				,"重庆"];

	var cities = {
				"北京": [
					"北京"
					],
				"福建": [
					"厦门"
					],
				"江苏": [
					"常州"
					,"南京"
					,"苏州"
					,"扬州"
					,"张家港"
					],
				"辽宁": [
					"抚顺"
					,"沈阳"
					],
				"山东": [
					"滨州"
					,"德州"
					,"东营"
					,"高密"
					,"海阳"
					,"菏泽"
					,"济南"
					,"龙口"
					,"蓬莱"
					,"青岛"
					,"日照"
					,"威海"
					,"潍坊"
					,"烟台"
					,"招远"
					],
				"陕西": [
					"安康"
					,"宝鸡"
					,"汉中"
					,"渭南"
					,"西安"
					,"咸阳"
					],
				"天津": [
					"天津"
					],
				"新疆": [
					"昌吉"
					,"克拉玛依"
					,"库尔勒"
					,"奎屯"
					,"乌鲁木齐"
					,"伊宁"
					],
				"浙江": [
					"湖州"
					],
				"重庆": [
					"重庆"
					]
				};

	var events = Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];

	var panelTpl = "<div id='panel' class='panel clearfix animated zoomIn'>"
					+ "{{#each items}}"
					+ "<div class='item'><a>"
					+ "{{this}}"
					+ "</a></div>"
					+ "{{/each}}"
					+ "<div></div>"
					+ "</div>";
	var template = Handlebars.compile(panelTpl);

	var state = null;
	var displayPanel = function(items, callback) {
		if (items === undefined || items === []) {
			return;
		}

		if ($(".panel").size() > 0) {
			return;
		}

		var panel = $(template({"items": items}));
		if (Q.isAndroid) {
			panel.appendTo('body')
			.one(events[2], "a", function() {
				panel.addClass("zoomOut");
				panel.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
					panel.remove();
				});
				callback && callback($(this).text());
			});
		} else {
			panel.css({
				"left": "0",
				"top": "0",
				"width": "100%",
				"box-sizing": "border-box",
				"height": "initial",
				"overflow": "hidden",
				"min-height": "100%"
			}).appendTo('body');

			$("a", panel).tappable({
				callback: function() {
					callback && callback($(this).text());
					panel.remove();
				},
				touchDelay: 200,
				cancelOnMove: true
			});
		}
	};

	var city = ns.city = {
		selectState: function(callback) {
			displayPanel(states, function(selectedState) {
				state = selectedState;
				callback.apply(null, arguments);
			});
		},
		selectCity: function(callback) {
			displayPanel(cities[state], callback);
		}
	};

})();