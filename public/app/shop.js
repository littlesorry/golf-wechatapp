(function () {
	var ns = Q.use("bag");

	var shopTexts = [];

	var yArchors = [
		0.558,
		0.640,
		0.720,
		0.809,
		0.895
	];

	function initLocationPosition(text, idx) {
		text.x = ns.game.width * 0.075;
		text.y = ns.game.height * yArchors[idx];
	}

	function initRemainingPosition(text, idx) {
		text.x = ns.game.width * 0.65;
		text.y = ns.game.height * (yArchors[idx] + 0.011);
	}

	var shop = ns.shop = {
		renderShops: function(data) {
			if (ns.game.state === "silver") {

			}

			for (var i = shopTexts.length - 1; i >= 0; i--) {
				ns.game.stage.removeChild(shopTexts[i]);
			}
			shopTexts.length = 0;
			for (var i = 0; i < data.length && i < 5; i++) {
				var shopText = new Q.Text({id: "shopText"});
				shopText.width = ns.game.state === "silver" ? 530 : 235;
				shopText.height = 80;
				shopText.scaleX = ns.game.cityResultPage.scaleX;
				shopText.scaleY = ns.game.cityResultPage.scaleY;
				shopText.textAlign = "start"; 
				shopText.lineSpacing = 30; 
				shopText.color = "#fff";
				shopText.text = data[i].address;
				shopText.font = "32px 黑体";
				initLocationPosition(shopText, i);

				ns.game.stage.addChild(shopText);
				shopTexts.push(shopText);

				if (ns.game.state === "gold") {
					var remainingText = new Q.Text({id: "remainingText"});
					remainingText.width = 120;
					remainingText.height = 52;
					remainingText.scaleX = ns.game.cityResultPage.scaleX;
					remainingText.scaleY = ns.game.cityResultPage.scaleY;
					remainingText.textAlign = "start"; 
					remainingText.lineSpacing = 35; 
					remainingText.color = "#fff";
					remainingText.text = data[i].remainingNumber || 0;
					remainingText.font = "35px 黑体";
					initRemainingPosition(remainingText, i);

					ns.game.stage.addChild(remainingText);
					shopTexts.push(remainingText);
				}
			}

		}
	};

})();