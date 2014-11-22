(function () {
	var ns = Q.use("bag");

	var history = ns.history = {
		states: []
	};

	history.push = function(state, url) {
		window.history.pushState(state, "", url);
		this.states.push(state);
	};

	window.onpopstate = function(event) {
		var last = history.states.pop();
		ns.game[last] && typeof ns.game[last].cleanup === 'function' && ns.game[last].cleanup.call();

		var current = event.state;
		current && typeof current.render === 'function' && current.render.call();
	};
})();