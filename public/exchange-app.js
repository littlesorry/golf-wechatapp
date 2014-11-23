(function() {

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
		
		this.displayPage16();
	};

	game.update = function(timeInfo) {
		this.frames++;
	};

	game.displayPage16 = function() {	
		if(this.exchangePage == null) {
			this.exchangePage = buildBackground("exchangePage", "page16");

			var exchangeBtn = new Q.Button({id:"exchangeBtn", image: ns.R.getImage("button")});
			exchangeBtn.setUpState({rect:[0,0,450,79]});
			exchangeBtn.width= 450;
			exchangeBtn.height = 79;
			exchangeBtn.scaleX = this.exchangePage.scaleX;
			exchangeBtn.scaleY = this.exchangePage.scaleY;
			exchangeBtn.x = this.width * 0.145;
			exchangeBtn.y = this.height * 0.734;
			exchangeBtn.on(game.EVENTS.TAP, function(e) {
				// TODO
				game.displayPage17();
			});

			this.exchangeBtn = exchangeBtn;
		}
		
		this.stage.addChild(
					this.exchangePage
					, this.exchangeBtn);

		this.stage.step();
	};

	game.displayPage16 = function() {	
		if(this.exchangePage == null) {
			this.exchangePage = buildBackground("exchangePage", "page16");

			var exchangeBtn = new Q.Button({id:"exchangeBtn", image: ns.R.getImage("button")});
			exchangeBtn.setUpState({rect:[0,0,450,79]});
			exchangeBtn.width= 450;
			exchangeBtn.height = 79;
			exchangeBtn.scaleX = this.exchangePage.scaleX;
			exchangeBtn.scaleY = this.exchangePage.scaleY;
			exchangeBtn.x = this.width * 0.145;
			exchangeBtn.y = this.height * 0.7;
			exchangeBtn.on(game.EVENTS.TAP, function(e) {
				// TODO
				game.displayPage17();
			});

			this.exchangeBtn = exchangeBtn;
		}
		
		this.stage.addChild(
					this.exchangePage
					, this.exchangeBtn);

		this.stage.step();
	};

	game.displayPage17 = function() {
		if(this.resultPage == null) {
			this.resultPage = buildBackground("resultPage", "page17");

			var goBtn = new Q.Button({id:"goBtn", image: ns.R.getImage("button")});
			goBtn.setUpState({rect:[0,0,450,79]});
			goBtn.width= 450;
			goBtn.height = 79;
			goBtn.scaleX = this.resultPage.scaleX;
			goBtn.scaleY = this.resultPage.scaleY;
			goBtn.x = this.width * 0.145;
			goBtn.y = this.height * 0.745;
			goBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage18();
			});

			this.goBtn = goBtn;
		}
		
		this.stage.addChild(
					this.resultPage
					, this.goBtn);

		this.stage.step();
	};

	game.displayPage18 = function() {
		if(this.registerPage == null) {
			this.registerPage = buildBackground("registerPage", "page18");

			var submitBtn = new Q.Button({id:"submitBtn", image: ns.R.getImage("button")});
			submitBtn.setUpState({rect:[0,0,450,79]});
			submitBtn.width= 450;
			submitBtn.height = 79;
			submitBtn.scaleX = this.registerPage.scaleX;
			submitBtn.scaleY = this.registerPage.scaleY;
			submitBtn.x = this.width * 0.145;
			submitBtn.y = this.height * 0.78;
			submitBtn.on(game.EVENTS.TAP, function(e) {
				// TODO
			});

			this.submitBtn = submitBtn;
		}
		
		this.stage.addChild(
					this.registerPage
					, this.submitBtn);

		this.stage.step();
	};

	$(function() {
		game.bootstrap();
	});

})();