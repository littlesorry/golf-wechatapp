(function () {
	var ns = Q.use("bag");

	var history = ns.history = {
		states: [],
		cleanup: null,
		disabled: false
	};

	var root;

	history.push = function(state, url) {
		if (this.disabled) return;
		
		window.history.pushState(state, "", url);
	};

	history.replace = function(state, url) {
		window.history.replaceState(state, "", url);
	};

	history.root = function(r) {
		root = r;
	};

	window.onpopstate = function(event) {
		$(".ui-item").hide();
		typeof history.cleanup === 'function' && history.cleanup.apply(ns.game);

		var current = event.state;
		if (current) {
			typeof ns.game[current] === 'function' && ns.game[current].apply(ns.game);
		} else {
			ns.game[root].apply(ns.game);
		}
	};
})();