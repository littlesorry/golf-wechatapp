(function () {
	var ns = Q.use("bag");

	var states = {
		items: [
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
		]
	};

	var cities = {
		items: [
			{name: "北京1"},
			{name: "上海1"},
			{name: "天津"},
			{name: "重庆"},
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
			{name: "北京"},
			{name: "上海"},
			{name: "天津"},
			{name: "重庆"},
		]
	};

	var events = Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];

	var panelTpl = "<div id='panel' class='panel animated zoomIn'>"
					+ "{{#each items}}"
					+ "<div class='item'><a>"
					+ "{{name}}"
					+ "</a></div>"
					+ "{{/each}}"
					+ "</div>";
	var template = Handlebars.compile(panelTpl);

	var displayPanel = function(items, callback) {
		var panel = $(template(items))
			.appendTo('body')
			.on(events[2], "a", function() {
				panel.addClass("zoomOut");
				panel.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
					panel.remove();
				});
				callback && callback($(this).text());
			});
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