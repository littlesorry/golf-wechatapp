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
		if (history.states[history.states.length - 1] !== state) {
			window.history.pushState(state, "", url);
			this.states.push(state);
		}
	};

	history.replace = function(state, url) {
		window.history.replaceState(state, "", url);
		this.states.length = 0;
		this.states.push(state);
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