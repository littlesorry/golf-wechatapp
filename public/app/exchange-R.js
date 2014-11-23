(function () {
	var ns = Q.use("bag");

	var R = ns.R = {};

	R.assets = [
		{id: "button", width: 423, src: "assets/button.png"},
		{id: "checkbox", width: 66, src: "assets/checkbox.png"},
		{id: "pickBagRed1", width: 66, src: "assets/02_bag_1.png"},
		{id: "pickBagBlue1", width: 66, src: "assets/02_bag_2.png"},
		{id: "pickBagBlue2", width: 66, src: "assets/02_bag_3.png"},
		{id: "pickBagRed2", width: 66, src: "assets/02_bag_4.png"},
		{id: "pickedRed", width: 66, src: "assets/03_bag_red.png"},
		{id: "pickedBlue", width: 66, src: "assets/03_bag_blue.png"},
		{id: "page16", width: 640, src: "assets/16-01.jpg"},
		{id: "page17", width: 640, src: "assets/17-01.jpg"},
		{id: "page17_2", width: 640, src: "assets/17-02.jpg"},
		{id: "page18", width: 640, src: "assets/18-01.jpg"}
	];

	R.backgroundAssets = [
		{id: "guideBg", width: 640, src: "assets/13-01.jpg"}
	];

	R.init = function(images) {
		this.images = images;

		var loader = new Q.ImageLoader();
		loader.addEventListener("complete", function(e) {
			console.log(e);
		});
		loader.load(R.backgroundAssets);
	};

	R.getImage = function(id) {
		try {
			return this.images[id].image;
		} catch (e) {
			alert(e);
		}
	}

})();