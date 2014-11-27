(function() {

	var ns = Q.use("bag");

	var game = window.game = ns.game = {
		frames: 0,
		events: Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"],
		params: Q.getUrlParams(),
		state: "not_completed",
		data: {
			isMember: true
		},
		selectedState: "省份",
		selectedCity: "城市"
	};

	function buildBackground(id, imageId) {
		var page = new Q.Bitmap({"id": id, "image": ns.R.getImage(imageId)});
        var sX = game.stage.width/page.width;
		var sY = game.stage.height/page.height;
        page.scaleX = sX;
        page.scaleY = sY;
        page.x = 0;
        page.y = 0;

        return page;
	};

	game.bootstrap = function() {
		var container = Q.getDOM("container");
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.width = container.clientWidth + "px";
		div.style.left = "0px";
		div.style.top = (container.clientHeight >> 1) + "px";
		div.style.textAlign = "center";
		div.style.color = "#fefefe";
		div.style.font = Q.isMobile ?  'bold 16px 黑体' : 'bold 16px 黑体';
		div.style.textShadow = Q.isAndroid ? "0 2px 2px #111" : "0 2px 2px #ccc";
		container.appendChild(div);
		this.loader = div;

		var loader = new Q.ImageLoader();
		loader.addEventListener("loaded", Q.delegate(this.onLoadLoaded, this));
		loader.addEventListener("complete", Q.delegate(this.onLoadComplete, this));
		loader.load(ns.R.assets);
	};

	game.onLoadLoaded = function(e) {
		this.loader.innerHTML = "正在加载资源中，请稍候...<br>";
		this.loader.innerHTML += "(" + Math.round(e.target.getLoaded() / e.target.getTotal() * 100) + "%)";
	};

	game.onLoadComplete = function(e) {
		e.target.removeAllEventListeners();
		Q.getDOM("container").removeChild(this.loader);
		this.loader = null;
		
		ns.R.init(e.images);

		this.startup();
	};

	game.startup = function() {
		if(Q.isWebKit && Q.supportTouch)
		{
			document.body.style.webkitTouchCallout = "none";
			document.body.style.webkitUserSelect = "none";
			document.body.style.webkitTextSizeAdjust = "none";
			document.body.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
		}
		
		this.container = Q.getDOM("container");
		this.width = this.container.clientWidth;
		this.height = this.container.clientHeight;
		
		//初始化context
		var context = null;
		if(this.params.canvas) {
			var canvas = Q.createDOM("canvas", {id:"canvas", width:this.width, height:this.height, style:{position:"absolute"}});
			this.container.appendChild(canvas);
			this.context = new Q.CanvasContext({canvas:canvas});
		} else {
			this.context = new Q.DOMContext({canvas: this.container});
		}
		
		//创建舞台
		this.stage = new Q.Stage({width:this.width, height:this.height, context:this.context, update:Q.delegate(this.update, this)});

		var timer = new Q.Timer(1000 / 30);
		timer.addListener(this.stage);
		timer.addListener(Q.Tween);
		timer.start();
		this.timer = timer;


		//注册事件
		var em = new Q.EventManager();
		this.EVENTS = {
			TAP: game.events[2]
		};

		em.registerStage(this.stage, this.events);
		
		this.displayPage0();
	};

	game.update = function(timeInfo) {
		this.frames++;
	};


	function updateCheckbox() {
		if (game.data.isMember) {
			game.yesBox.changeState(Q.Button.DOWN);
			game.noBox.changeState(Q.Button.UP);
		} else {
			game.noBox.changeState(Q.Button.DOWN);
			game.yesBox.changeState(Q.Button.UP);
		}
	}

	game.displayPage0 = function() {	
		if(this.initPage == null) {
			this.initPage = buildBackground("initPage", "page0");

			var chooseBtn = new Q.Button({id:"chooseBtn", image: ns.R.getImage("button")});
			chooseBtn.setUpState({rect:[0,0,450,79]});
			chooseBtn.width= 450;
			chooseBtn.height = 79;
			chooseBtn.scaleX = this.initPage.scaleX;
			chooseBtn.scaleY = this.initPage.scaleY;
			chooseBtn.x = this.width * 0.145;
			chooseBtn.y = this.height * 0.658;
			chooseBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage1();
			});

			this.chooseBtn = chooseBtn;

			var exchangeBtn = new Q.Button({id:"exchangeBtn", image: ns.R.getImage("button")});
			exchangeBtn.setUpState({rect:[0,0,450,79]});
			exchangeBtn.width= 450;
			exchangeBtn.height = 79;
			exchangeBtn.scaleX = this.initPage.scaleX;
			exchangeBtn.scaleY = this.initPage.scaleY;
			exchangeBtn.x = this.width * 0.145;
			exchangeBtn.y = this.height * 0.734;
			exchangeBtn.on(game.EVENTS.TAP, function(e) {
				window.location = 'exchange.html';
			});

			this.exchangeBtn = exchangeBtn;

			var instructionBtn = new Q.Button({id:"instructionBtn", image: ns.R.getImage("button")});
			instructionBtn.setUpState({rect:[0,0,310,79]});
			instructionBtn.width= 310;
			instructionBtn.height = 79;
			instructionBtn.scaleX = this.initPage.scaleX;
			instructionBtn.scaleY = this.initPage.scaleY;
			instructionBtn.x = this.width * 0;
			instructionBtn.y = this.height * 0.93;
			instructionBtn.on(game.EVENTS.TAP, function(e) {
				window.location = 'instruction.html';
			});

			this.instructionBtn = instructionBtn;

			var baglistBtn = new Q.Button({id:"baglistBtn", image: ns.R.getImage("button")});
			baglistBtn.setUpState({rect:[0,0,310,79]});
			baglistBtn.width= 310;
			baglistBtn.height = 79;
			baglistBtn.scaleX = this.initPage.scaleX;
			baglistBtn.scaleY = this.initPage.scaleY;
			baglistBtn.x = this.width * 0.5;
			baglistBtn.y = this.height * 0.93;
			baglistBtn.on(game.EVENTS.TAP, function(e) {
				// TODO:
			});

			this.baglistBtn = baglistBtn;

		}
		
		this.stage.addChild(
					this.initPage
					, this.chooseBtn
					, this.exchangeBtn
					, this.instructionBtn
					, this.baglistBtn);
		this.stage.step();
    	ns.history.push("displayPage0", "#displayPage0");
	};

	game.displayPage1 = function() {	
		if(this.startPage == null) {
			this.startPage = buildBackground("startPage", "page1");

			var playBtn = new Q.Button({id:"playBtn", image: ns.R.getImage("button")});
			playBtn.setUpState({rect:[0,0,450,79]});
			playBtn.width= 450;
			playBtn.height = 79;
			playBtn.scaleX = this.startPage.scaleX;
			playBtn.scaleY = this.startPage.scaleY;
			playBtn.x = this.width * 0.145;
			playBtn.y = this.height * 0.806;
			playBtn.on(game.EVENTS.TAP, function(e) {
				$("#ageInput").hide();
				game.displayPage2();
			});

			this.playBtn = playBtn;

			var yesBox = new Q.Button({id:"yesBox", image: ns.R.getImage("checkbox")});
			yesBox.setUpState({rect:[0,0,66,32]});
			yesBox.setDownState({rect:[0,32,66,32]});
			yesBox.width= 66;
			yesBox.height = 32;
			yesBox.scaleX = this.startPage.scaleX;
			yesBox.scaleY = this.startPage.scaleY;
			yesBox.x = this.width * 0.572;
			yesBox.y = this.height * 0.717;

			this.yesBox = yesBox;

			var yesBtn = new Q.Button({id:"yesBtn", image: ns.R.getImage("button")});
			yesBtn.setUpState({rect:[0,0,66,32]});
			yesBtn.width= 66;
			yesBtn.height = 32;
			yesBtn.scaleX = this.startPage.scaleX;
			yesBtn.scaleY = this.startPage.scaleY;
			yesBtn.x = this.width * 0.572;
			yesBtn.y = this.height * 0.717;
			yesBtn.on(game.EVENTS.TAP, function(e) {
				updateCheckbox(game.data.isMember = true);
			});

			this.yesBtn = yesBtn;

			var noBox = new Q.Button({id:"noBox", image: ns.R.getImage("checkbox")});
			noBox.setUpState({rect:[0,0,66,32]});
			noBox.setDownState({rect:[0,32,66,32]});
			noBox.width= 66;
			noBox.height = 32;
			noBox.scaleX = this.startPage.scaleX;
			noBox.scaleY = this.startPage.scaleY;
			noBox.x = this.width * 0.713;
			noBox.y = this.height * 0.717;

			this.noBox = noBox;

			var noBtn = new Q.Button({id:"noBtn", image: ns.R.getImage("button")});
			noBtn.setUpState({rect:[0,0,66,32]});
			noBtn.width= 66;
			noBtn.height = 32;
			noBtn.scaleX = this.startPage.scaleX;
			noBtn.scaleY = this.startPage.scaleY;
			noBtn.x = this.width * 0.713;
			noBtn.y = this.height * 0.717;
			noBtn.on(game.EVENTS.TAP, function(e) {
				updateCheckbox(game.data.isMember = false);
			});

			this.noBtn = noBtn;
		}
		
		this.stage.addChild(
					this.startPage
					, this.playBtn
					, this.yesBox
					, this.noBox
					, this.yesBtn
					, this.noBtn);
		updateCheckbox();
		this.stage.step();

		if ($("#ageInput").size() < 1) {
		    var ageInput = Q.createDOM("input"
				, {
					id:"ageInput"
					, type: "number"
					, maxlength: 3
					, style : {
						position:"absolute",
						top : (game.height * 0.678) + "px",
						left: (game.width * 0.573) + "px",
						width: (game.width * 0.183)+ "px",
						height: (game.height * 0.03) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#333",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "3px"
					}
			});
			setTimeout(function() {
    			$("body").prepend(ageInput);
			}, 500);
		} else {
			setTimeout(function() {
				$("#ageInput").show();
			}, 500);
		}

    	ns.history.push("displayPage1", "#displayPage1");
	};

	game.displayPage1.cleanup = function() {
		$("#ageInput").hide();
	};

	game.displayPage2 = function() {	
		if(this.pickPage == null) {
			this.pickPage = buildBackground("pickPage", "page2");

			var pickBtnRed1 = new Q.Button({id:"pickBtnRed1", image: ns.R.getImage("pickBagRed1")});
			pickBtnRed1.setUpState({rect:[0,0,255,305]});
			pickBtnRed1.width= 255;
			pickBtnRed1.height = 305;
			pickBtnRed1.scaleX = this.pickPage.scaleX;
			pickBtnRed1.scaleY = this.pickPage.scaleY;
			pickBtnRed1.x = this.width * 0.11;
			pickBtnRed1.y = this.height * 0.32;
			pickBtnRed1.on(game.EVENTS.TAP, function(e) {
				game.displayPage3('red');
			});

			this.pickBtnRed1 = pickBtnRed1;

			var pickBtnBlue1 = new Q.Button({id:"pickBtnBlue1", image: ns.R.getImage("pickBagBlue1")});
			pickBtnBlue1.setUpState({rect:[0,0,266,304]});
			pickBtnBlue1.width= 266;
			pickBtnBlue1.height = 304;
			pickBtnBlue1.scaleX = this.pickPage.scaleX;
			pickBtnBlue1.scaleY = this.pickPage.scaleY;
			pickBtnBlue1.x = this.width * 0.52;
			pickBtnBlue1.y = this.height * 0.32;
			pickBtnBlue1.on(game.EVENTS.TAP, function(e) {
				game.displayPage3();
			});

			this.pickBtnBlue1 = pickBtnBlue1;

			var pickBtnRed2 = new Q.Button({id:"pickBtnRed2", image: ns.R.getImage("pickBagRed2")});
			pickBtnRed2.setUpState({rect:[0,0,266,305]});
			pickBtnRed2.width= 266;
			pickBtnRed2.height = 305;
			pickBtnRed2.scaleX = this.pickPage.scaleX;
			pickBtnRed2.scaleY = this.pickPage.scaleY;
			pickBtnRed2.x = this.width * 0.52;
			pickBtnRed2.y = this.height * 0.585;
			pickBtnRed2.on(game.EVENTS.TAP, function(e) {
				game.displayPage3('red');
			});

			this.pickBtnRed2 = pickBtnRed2;

			var pickBtnBlue2 = new Q.Button({id:"pickBtnBlue2", image: ns.R.getImage("pickBagBlue2")});
			pickBtnBlue2.setUpState({rect:[0,0,274,306]});
			pickBtnBlue2.width= 274;
			pickBtnBlue2.height = 306;
			pickBtnBlue2.scaleX = this.pickPage.scaleX;
			pickBtnBlue2.scaleY = this.pickPage.scaleY;
			pickBtnBlue2.x = this.width * 0.09;
			pickBtnBlue2.y = this.height * 0.585;
			pickBtnBlue2.on(game.EVENTS.TAP, function(e) {
				game.displayPage3();
			});

			this.pickBtnBlue2 = pickBtnBlue2;
		}
		
		this.stage.addChild(
					this.pickPage
					, this.pickBtnRed1
					, this.pickBtnRed2
					, this.pickBtnBlue1
					, this.pickBtnBlue2);
		this.stage.step();

		ns.history.push("displayPage2", "#displayPage2");
	};

	game.displayPage3 = function(bag) {	
		if(this.openPage == null) {
			this.openPage = buildBackground("openPage", "page3");

			var openBtn = new Q.Button({id:"openBtn", image: ns.R.getImage("button")});
			openBtn.setUpState({rect:[0,0,390,79]});
			openBtn.width= 390;
			openBtn.height = 79;
			openBtn.scaleX = this.openPage.scaleX;
			openBtn.scaleY = this.openPage.scaleY;
			openBtn.x = this.width * 0.2;
			openBtn.y = this.height * 0.499;
			openBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage4();
			});

			this.openBtn = openBtn;
		}

		var pickedBag = new Q.Bitmap({"id": "pickedBag", "image": ns.R.getImage(bag === 'red'? 'pickedRed' : 'pickedBlue')});
        pickedBag.scaleX = this.openPage.scaleX;
        pickedBag.scaleY = this.openPage.scaleY;
        pickedBag.x = this.width * 0.25;
        pickedBag.y = this.height * 0.17;

        this.pickedBag = pickedBag;
		
		this.stage.addChild(
					this.openPage
					, this.pickedBag
					, this.openBtn);
		this.stage.step();

		ns.history.push("displayPage3", "#displayPage3");
	};

	game.displayPage4 = function() {
		game.state = "gold";
		if(this.goldPrizePage == null) {
			this.goldPrizePage = buildBackground("goldPrizePage", "page4");

			var reserveBtn = new Q.Button({id:"reserveBtn", image: ns.R.getImage("button")});
			reserveBtn.setUpState({rect:[0,0,390,79]});
			reserveBtn.width= 390;
			reserveBtn.height = 79;
			reserveBtn.scaleX = this.goldPrizePage.scaleX;
			reserveBtn.scaleY = this.goldPrizePage.scaleY;
			reserveBtn.x = this.width * 0.18;
			reserveBtn.y = this.height * 0.568;
			reserveBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage7('gold');
			});

			this.reserveBtn = reserveBtn;

			var bagCode = new Q.Text({id: "bagCode"});
			bagCode.width = 245;
			bagCode.height = 52;
			bagCode.scaleX = this.goldPrizePage.scaleX;
			bagCode.scaleY = this.goldPrizePage.scaleY;
			bagCode.x = this.width * 0.366;
			bagCode.y = this.height * 0.388;
			bagCode.textAlign = "start"; 
			bagCode.lineSpacing = 35; 
			bagCode.color = "#fff";
			bagCode.text = "TEST0123";
			bagCode.font = "40px arial"

			this.bagCode = bagCode;

			var couponCode = new Q.Text({id: "couponCode"});
			couponCode.width = 220;
			couponCode.height = 52;
			couponCode.scaleX = this.goldPrizePage.scaleX;
			couponCode.scaleY = this.goldPrizePage.scaleY;
			couponCode.x = this.width * 0.42;
			couponCode.y = this.height * 0.448;
			couponCode.textAlign = "start"; 
			couponCode.lineSpacing = 35; 
			couponCode.color = "#fff";
			couponCode.text = "TEST0123";
			couponCode.font = "40px arial"

			this.couponCode = couponCode;
		}
		
		this.stage.addChild(
					this.goldPrizePage
					, this.bagCode
					, this.couponCode
					, this.reserveBtn);
		this.stage.step();
		ns.history.push("displayPage4", "#displayPage4");
	};

	game.displayPage5 = function() {
		game.state = "silver";
		if(this.silverPrizePage == null) {
			this.silverPrizePage = buildBackground("silverPrizePage", "page5");

			var openBtn2 = new Q.Button({id:"openBtn2", image: ns.R.getImage("button")});
			openBtn2.setUpState({rect:[0,0,390,79]});
			openBtn2.width= 390;
			openBtn2.height = 79;
			openBtn2.scaleX = this.silverPrizePage.scaleX;
			openBtn2.scaleY = this.silverPrizePage.scaleY;
			openBtn2.x = this.width * 0.176;
			openBtn2.y = this.height * 0.57;
			openBtn2.on(game.EVENTS.TAP, function(e) {
				game.displayPage7('silver');
			});

			this.openBtn2 = openBtn2;

			var silverCode = new Q.Text({id: "silverCode"});
			silverCode.width = 220;
			silverCode.height = 52;
			silverCode.scaleX = this.silverPrizePage.scaleX;
			silverCode.scaleY = this.silverPrizePage.scaleY;
			silverCode.x = this.width * 0.427;
			silverCode.y = this.height * 0.385;
			silverCode.textAlign = "start"; 
			silverCode.lineSpacing = 35; 
			silverCode.color = "#fff";
			silverCode.text = "TEST0123";
			silverCode.font = "40px arial"

			this.silverCode = silverCode;
		};
		
		this.stage.addChild(
					this.silverPrizePage
					, this.silverCode
					, this.openBtn2);
		this.stage.step();

		ns.history.push("displayPage5", "#displayPage5");
	};

	function pickPrePage(bag) {
		var pageSrc = bag === 'gold' ? "page71" : "page72"
		return pageSrc;
	}

	function pickPage(bag, data) {
		var pageSrc = bag === 'gold' ? "page71" : "page72"
		pageSrc += data ? "2" : "";

		return pageSrc;
	}

	game.displayPage7 = function(bag) {	
		if(this.cityPage == null) {
			this.cityPage = buildBackground("cityPage", pickPrePage(bag));

			var queryBtn = new Q.Button({id:"queryBtn", image: ns.R.getImage("button")});
			queryBtn.setUpState({rect:[0,0,390,79]});
			queryBtn.width= 390;
			queryBtn.height = 79;
			queryBtn.scaleX = this.cityPage.scaleX;
			queryBtn.scaleY = this.cityPage.scaleY;
			queryBtn.x = this.width * 0.2;
			queryBtn.y = this.height * 0.39;
			queryBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage7Result(bag, {});
			});

			this.queryBtn = queryBtn;

			var stateText = new Q.Text({id: "stateText"});
			stateText.width = 255;
			stateText.height = 52;
			stateText.scaleX = this.cityPage.scaleX;
			stateText.scaleY = this.cityPage.scaleY;
			stateText.x = this.width * 0.075;
			stateText.y = this.height * 0.315;
			stateText.textAlign = "start"; 
			stateText.lineSpacing = 35; 
			stateText.color = "#fff";
			stateText.text = "省份";
			stateText.font = "35px 黑体";
			stateText.on(game.EVENTS.TAP, function(e) {
				ns.city.selectState(function(state) {
					stateText.text = state;
					game.selectedState = state;
					cityText.text = "城市";
				});
			});

			this.stateText = stateText;

			var cityText = new Q.Text({id: "cityText"});
			cityText.width = 255;
			cityText.height = 52;
			cityText.scaleX = this.cityPage.scaleX;
			cityText.scaleY = this.cityPage.scaleY;
			cityText.x = this.width * 0.535;
			cityText.y = this.height * 0.315;
			cityText.textAlign = "start"; 
			cityText.lineSpacing = 35; 
			cityText.color = "#fff";
			cityText.text = "城市";
			cityText.font = "35px 黑体";
			cityText.on(game.EVENTS.TAP, function(e) {
				ns.city.selectCity(function(city) {
					cityText.text = city;
					game.selectedCity = city;
				});
			});

			this.cityText = cityText;
		}
		
		this.stage.addChild(
					this.cityPage
					, this.stateText
					, this.cityText
					, this.queryBtn);
		this.stage.step();

		ns.history.push("displayPage7", "#displayPage7");
	};

	game.displayPage7Result = function(bag, data) {
		if(this.cityResultPage == null) {
			this.cityResultPage = buildBackground("cityResultPage", pickPage(bag, data));

			var resultQueryBtn = new Q.Button({id:"resultQueryBtn", image: ns.R.getImage("button")});
			resultQueryBtn.setUpState({rect:[0,0,390,79]});
			resultQueryBtn.width= 390;
			resultQueryBtn.height = 79;
			resultQueryBtn.scaleX = this.cityResultPage.scaleX;
			resultQueryBtn.scaleY = this.cityResultPage.scaleY;
			resultQueryBtn.x = this.width * 0.2;
			resultQueryBtn.y = this.height * 0.39;
			resultQueryBtn.on(game.EVENTS.TAP, function(e) {
				// TODO:
				game.displayPage7Result(bag, [{location: "XXXXXX市某某路某某路", remaining: Math.random()}, {location: "XXXXXX市某某路某某路", remaining: 1}, {location: "XXXXXX市某某路某某路", remaining: 1}, {location: "XXXXXX市某某路某某路", remaining: 1}, {location: "XXXXXX市某某路某某路", remaining: 1}]);
			});

			this.resultQueryBtn = resultQueryBtn;

			var stateResultText = new Q.Text({id: "stateResultText"});
			stateResultText.width = 255;
			stateResultText.height = 52;
			stateResultText.scaleX = this.cityResultPage.scaleX;
			stateResultText.scaleY = this.cityResultPage.scaleY;
			stateResultText.x = this.width * 0.075;
			stateResultText.y = this.height * 0.315;
			stateResultText.textAlign = "start"; 
			stateResultText.lineSpacing = 35; 
			stateResultText.color = "#fff";
			stateResultText.text = game.selectedState;
			stateResultText.font = "35px 黑体";
			stateResultText.on(game.EVENTS.TAP, function(e) {
				ns.city.selectState(function(state) {
					stateResultText.text = state;
					cityResultText.text = "城市";
				});
			});

			this.stateResultText = stateResultText;

			var cityResultText = new Q.Text({id: "cityResultText"});
			cityResultText.width = 255;
			cityResultText.height = 52;
			cityResultText.scaleX = this.cityResultPage.scaleX;
			cityResultText.scaleY = this.cityResultPage.scaleY;
			cityResultText.x = this.width * 0.535;
			cityResultText.y = this.height * 0.315;
			cityResultText.textAlign = "start"; 
			cityResultText.lineSpacing = 35; 
			cityResultText.color = "#fff";
			cityResultText.text = game.selectedCity;
			cityResultText.font = "35px 黑体";
			cityResultText.on(game.EVENTS.TAP, function(e) {
				ns.city.selectCity(function(city) {
					cityResultText.text = city;
				});
			});

			this.cityResultText = cityResultText;
		}

		this.stage.addChild(
					this.cityResultPage
					, this.stateResultText
					, this.cityResultText
					, this.resultQueryBtn);
		ns.shop.renderShops(data);
		this.stage.step();
		ns.history.push("displayPage7Result", "#displayPage7Result");
	};

	$(function() {
		game.bootstrap();
	});

})();