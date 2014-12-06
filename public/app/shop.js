(function () {
	var ns = Q.use("bag");
	
	var events = Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];

	var yArchors = [
		0.557,
		0.639,
		0.721,
		0.810,
		0.896
	];

	function initLocationPosition(text, idx) {
		text.x = ns.game.width * 0.075;
		text.y = ns.game.height * yArchors[idx%5];
	}

	function initRemainingPosition(text, idx) {
		text.x = ns.game.width * 0.78;
		text.y = ns.game.height * (yArchors[idx%5] + 0.012);
	}

	function renderShopText(data, page) {
		// remove current text first
		for (var i = shopTexts.length - 1; i >= 0; i--) {
			ns.game.stage.removeChild(shopTexts[i]);
		}
		shopTexts.length = 0;

		if (!data) {
			return;
		}

		// add next batch
		for (var i = page * 5; i < data.length && i < (page + 1) * 5; i++) {
			var shopText = new Q.Text({id: "shopText"});
			shopText.width = ns.game.state === "silver" ? 530 : 375;
			shopText.height = 80;
			shopText.scaleX = ns.game.cityResultPage.scaleX;
			shopText.scaleY = ns.game.cityResultPage.scaleY;
			shopText.textAlign = "start"; 
			shopText.lineSpacing = 29; 
			shopText.color = "#fff";
			shopText.text = data[i].address;
			shopText.font = "29px 黑体";
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
		ns.game.stage.step();

		if ((page + 1) * 5 < data.length) {
			$(".arrow-right").show();
		} else {
			$(".arrow-right").hide();
		}

		if (page > 0) {
			$(".arrow-left").show();
		} else {
			$(".arrow-left").hide();
		}
	}

	var page = 0;
	var currentData = [];
	var shopTexts = [];
	var shop = ns.shop = {
		renderShops: function(data) {
			if ($(".arrow").size() === 0) {
				$("<div class='arrow-right arrow' />").css({
					top : (game.height * 0.67) + "px",
					left: (game.width * 0.87) + "px"
				}).on(events[2], function() {
					$(this).hide();
					renderShopText(currentData, ++page);
				}).appendTo("body");

				$("<div class='arrow-left arrow' />").css({
					top : (game.height * 0.67) + "px",
					left: (game.width * 0.07) + "px"
				}).on(events[2], function() {
					$(this).hide();
					renderShopText(currentData, --page);
				}).appendTo("body");
			}
			currentData = data;
			renderShopText(currentData, page = 0);
		}
	};

})();