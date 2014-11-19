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
		{id: "page1", width: 640, src: "assets/1-01.jpg"},
		{id: "page2", width: 640, src: "assets/2-01_bg.jpg"},
		{id: "page3", width: 640, src: "assets/3-01.jpg"},
		{id: "page4", width: 640, src: "assets/4-01.jpg"},
		{id: "page5", width: 640, src: "assets/5-01.jpg"},
		{id: "page7", width: 640, src: "assets/7-01.jpg"}
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