(function () {
	var ns = Q.use("bag");

	var states = [
		"北京",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",	
		"重庆"
	];

	var cities = [
		"1北京",
		"上海",
		"天津",
		"2上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",
		"上海",
		"天津",	
		"重庆"
	];

	var events = Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];

	var displayPanel = function(items, callback) {
		var panel = $("<div id='panel' class='panel animated zoomIn'><ul></ul></div>")
			.appendTo('body')
			.on(events[2], "a", function() {
				panel.addClass("zoomOut");
				panel.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
					panel.remove();
				});
				callback && callback($(this).text());
			});

		for(var i = 0; i < items.length; i++) {
			$("ul", panel)
				.append("<li><a>" + items[i] + "</a></li>");
		}
	};

	var city = ns.city = {
		selectState: function(callback) {
			displayPanel(states, callback);
		},
		selectCity: function(callback) {
			displayPanel(cities, callback);
		}
	};

})();