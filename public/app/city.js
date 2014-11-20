(function () {
	var ns = Q.use("bag");

	var template = "<div id='states' class='panel'></div>";
	var listItem = "<li class='item'></li>";


	var city = ns.city = {
		selectState: function() {
			$("<div id='states' class='panel'/>")
				.appendTo('body');
		},
		selectCity: function() {

		}
	};

})();