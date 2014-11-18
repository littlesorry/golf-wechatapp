(function() {

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

	var ns = Q.use("bag");

	var game = window.game = ns.game = {
		frames: 0,
		events: Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"],
		params: Q.getUrlParams(),
		state: "not_completed",
		data: {
			isMember: true
		}
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
		div.style.color = "#333";
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
		
		if (game.params.refers > 0) {
			this.displayPage4();
		} else {
			this.displayPage1();
		}
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

	game.displayPage1 = function() {	
		if(this.startPage == null) {
			this.startPage = buildBackground("startPage", "page1");

			var playBtn = new Q.Button({id:"playBtn", image: ns.R.getImage("button")});
			playBtn.setUpState({rect:[0,0,390,79]});
			playBtn.width= 390;
			playBtn.height = 79;
			playBtn.scaleX = this.startPage.scaleX;
			playBtn.scaleY = this.startPage.scaleY;
			playBtn.x = this.width * 0.2;
			playBtn.y = this.height * 0.8;
			playBtn.on(game.EVENTS.TAP, function(e) {
				$("#ageInput").hide();
				game.displayPage2();
			});

			this.playBtn = playBtn;

			var instructionBtn = new Q.Button({id:"instructionBtn", image: ns.R.getImage("button")});
			instructionBtn.setUpState({rect:[0,0,310,79]});
			instructionBtn.width= 310;
			instructionBtn.height = 79;
			instructionBtn.scaleX = this.startPage.scaleX;
			instructionBtn.scaleY = this.startPage.scaleY;
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
			baglistBtn.scaleX = this.startPage.scaleX;
			baglistBtn.scaleY = this.startPage.scaleY;
			baglistBtn.x = this.width * 0.5;
			baglistBtn.y = this.height * 0.93;
			baglistBtn.on(game.EVENTS.TAP, function(e) {
				// TODO:
			});

			this.baglistBtn = baglistBtn;

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
					, this.instructionBtn
					, this.baglistBtn
					, this.yesBox
					, this.noBox
					, this.yesBtn
					, this.noBtn);
		updateCheckbox();
		this.stage.step();

	    var ageInput = Q.createDOM("input"
			, {
				id:"ageInput"
				, type: "number"
				, maxlength: 3
				, style : {
					position:"absolute",
					top : (game.height * 0.678) + "px",
					left: (game.width * 0.573) + "px",
					width: (game.width * 0.19)+ "px",
					height: game.height * 0.03 + "px",
					background: "transparent",
					border: "none",
					"text-align": "right",
					"padding-right": "4px",
					"color": "#333",
					"z-index": 9999,
					"font-size": "20px",
					"letter-spacing": "4px"
				}
			});
    	$("body").prepend(ageInput);
	};

	game.displayPage2 = function() {	
		if(this.pickPage == null) {
			this.pickPage = buildBackground("pickPage", "page2");

			var pickBtn = new Q.Button({id:"pickBtn", image: ns.R.getImage("button")});
			pickBtn.setUpState({rect:[0,0,520,580]});
			pickBtn.width= 520;
			pickBtn.height = 580;
			pickBtn.scaleX = this.pickPage.scaleX;
			pickBtn.scaleY = this.pickPage.scaleY;
			pickBtn.x = this.width * 0.09;
			pickBtn.y = this.height * 0.32;
			pickBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage3();
			});

			this.pickBtn = pickBtn;
		}
		
		this.stage.addChild(
					this.pickPage
					, this.pickBtn);
		this.stage.step();
	};

	game.displayPage3 = function() {	
		if(this.openPage == null) {
			this.openPage = buildBackground("openPage", "page3");

			var openBtn = new Q.Button({id:"openBtn", image: ns.R.getImage("button")});
			openBtn.setUpState({rect:[0,0,390,79]});
			openBtn.width= 390;
			openBtn.height = 79;
			openBtn.scaleX = this.startPage.scaleX;
			openBtn.scaleY = this.startPage.scaleY;
			openBtn.x = this.width * 0.2;
			openBtn.y = this.height * 0.499;
			openBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage4();
			});

			this.openBtn = openBtn;
		}
		
		this.stage.addChild(
					this.openPage
					, this.openBtn);
		this.stage.step();
	};

	game.displayPage4 = function() {	
		if(this.goldPrizePage == null) {
			this.goldPrizePage = buildBackground("goldPrizePage", "page4");

			var openBtn = new Q.Button({id:"openBtn", image: ns.R.getImage("button")});
			openBtn.setUpState({rect:[0,0,390,79]});
			openBtn.width= 390;
			openBtn.height = 79;
			openBtn.scaleX = this.startPage.scaleX;
			openBtn.scaleY = this.startPage.scaleY;
			openBtn.x = this.width * 0.2;
			openBtn.y = this.height * 0.499;
			openBtn.on(game.EVENTS.TAP, function(e) {
			});

			this.openBtn = openBtn;
		}
		
		this.stage.addChild(
					this.goldPrizePage
					, this.openBtn);
		this.stage.step();
	};

	game.displayPage5 = function() {	
		if(this.silverPrizePage == null) {
			this.silverPrizePage = buildBackground("silverPrizePage", "page5");

			var openBtn2 = new Q.Button({id:"openBtn2", image: ns.R.getImage("button")});
			openBtn2.setUpState({rect:[0,0,390,79]});
			openBtn2.width= 390;
			openBtn2.height = 79;
			openBtn2.scaleX = this.startPage.scaleX;
			openBtn2.scaleY = this.startPage.scaleY;
			openBtn2.x = this.width * 0.2;
			openBtn2.y = this.height * 0.499;
			openBtn2.on(game.EVENTS.TAP, function(e) {
			});

			this.openBtn2 = openBtn2;
		}
		
		this.stage.addChild(
					this.silverPrizePage
					, this.openBtn2);
		this.stage.step();
	};

	$(function() {
		game.bootstrap();
	});

})();