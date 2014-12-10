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

		ns.history.disabled = true;
		ns.history.root("displayPage16");
		ns.history.push("displayPage16", "#displayPage16");
		this.displayPage16();
	};

	game.update = function(timeInfo) {
		this.frames++;
	};

	function validateExchange(exchange, shop) {
		if (!exchange || exchange.length === 0) {
			return "请填写串号！";
		}
		if (!shop || shop.length === 0) {
			return "请填写柜台编码！";
		}
	}

	game.displayPage16 = function() {	
		NProgress.start();
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
				var error = validateExchange($("#exchangeInput").val(), $("#shopNoInput").val());
				if (error) {
					alert(error);
					return;
				}

				NProgress.start();
				$.get("/exchange", {
					couponCode: $("#exchangeInput").val(),
					shopCode: $("#shopNoInput").val()
				}).done(function(resp) {
					NProgress.done();

					if (resp.status === "fail: openId not matched") {
						alert("串码与微信号不匹配！");
						return;
					}

					$("#exchangeInput").hide();
					$("#shopNoInput").hide();		
					ns.history.push("displayPage17", "#displayPage17");
					game.displayPage17(resp.status);
				}) ;
			});

			this.exchangeBtn = exchangeBtn;
		}
		
		this.stage.addChild(
					this.exchangePage
					, this.exchangeBtn);

		this.stage.step();

		if ($("#exchangeInput").size() < 1) {
		    var exchangeInput = Q.createDOM("input"
				, {
					id:"exchangeInput"
					, type: "text"
					, className: "ui-item"
					, style : {
						position:"absolute",
						top : (game.height * 0.342) + "px",
						left: (game.width * 0.452) + "px",
						width: (game.width * 0.43)+ "px",
						height: (game.height * 0.054) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#fff",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "1px"
					}
			});

		    var shopNoInput = Q.createDOM("input"
				, {
					id:"shopNoInput"
					, type: "text"
					, className: "ui-item"
					, style : {
						position:"absolute",
						top : (game.height * 0.478) + "px",
						left: (game.width * 0.452) + "px",
						width: (game.width * 0.43)+ "px",
						height: (game.height * 0.054) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#fff",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "1px"
					}
			});
			setTimeout(function() {
    			$("body").prepend(exchangeInput);
    			$("body").prepend(shopNoInput);
    			NProgress.done();
			}, 800);
		} else {
			setTimeout(function() {
				$("#exchangeInput").show();
				$("#shopNoInput").show();
				NProgress.done();
			}, 800);
		}

	};


	var lastStatus = null;
	game.displayPage17 = function(status) {
		lastStatus = status;
		if(this.resultPage == null) {
			this.resultPage = buildBackground("resultPage", (status === 'fail' || status === 'error') ? "page17_2" : "page17");

			var goBtn = new Q.Button({id:"goBtn", image: ns.R.getImage("button")});
			goBtn.setUpState({rect:[0,0,450,79]});
			goBtn.width= 450;
			goBtn.height = 79;
			goBtn.scaleX = this.resultPage.scaleX;
			goBtn.scaleY = this.resultPage.scaleY;
			goBtn.x = this.width * 0.145;
			goBtn.y = this.height * 0.745;
			goBtn.on(game.EVENTS.TAP, function(e) {
				if (lastStatus === 'fail' || lastStatus === 'error') {
					// game.displayPage16();
					window.history.back();
				} else {
					ns.history.push("displayPage18", "#displayPage18");
					game.displayPage18();
				}
			});

			this.goBtn = goBtn;
		}
		
		this.stage.addChild(
					this.resultPage
					, this.goBtn);

		this.stage.step();
	};

	function validateRegistry(name, phone, personId, email) {
		if (!name || name.length === 0) {
			return "请填写姓名！";
		}
		if (!phone || phone.length === 0) {
			return "请填写手机号！";
		}

		if ( email && email.trim() !== "" && !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			.test(email)) {
			return "无效的email格式！";
		}
	}

	game.displayPage18 = function() {
		NProgress.start();
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
				var validate = validateRegistry($("#nameInput").val(), $("#mobileInput").val(), $("#idInput").val(), $("#emailInput").val());
				if (validate) {
					alert(validate);
					return;
				}

				NProgress.start();
				$.get("/register", {
					name: $("#nameInput").val(),
					phone: $("#mobileInput").val(),
					personId: $("#idInput").val(),
					email: $("#emailInput").val()
				}).done(function() {
					$("#nameInput").hide();
					$("#mobileInput").hide();
					$("#idInput").hide();
					$("#emailInput").hide();

					NProgress.done();

					ns.history.push("displayPage19", "#displayPage19");
					game.displayPage19();
				}) ;
			});

			this.submitBtn = submitBtn;
		}
		
		this.stage.addChild(
					this.registerPage
					, this.submitBtn);
		this.stage.step();

		if ($("#nameInput").size() < 1) {
		    var nameInput = Q.createDOM("input"
				, {
					id:"nameInput"
					, type: "text"
					, className: "ui-item"
					, style : {
						position:"absolute",
						top : (game.height * 0.396) + "px",
						left: (game.width * 0.382) + "px",
						width: (game.width * 0.505)+ "px",
						height: (game.height * 0.032) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#fff",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "1px"
					}
			});

		    var mobileInput = Q.createDOM("input"
				, {
					id:"mobileInput"
					, type: "text"
					, className: "ui-item"
					, style : {
						position:"absolute",
						top : (game.height * 0.455) + "px",
						left: (game.width * 0.382) + "px",
						width: (game.width * 0.505)+ "px",
						height: (game.height * 0.032) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#fff",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "1px"
					}
			});

		    var idInput = Q.createDOM("input"
				, {
					id:"idInput"
					, type: "text"
					, className: "ui-item"
					, style : {
						position:"absolute",
						top : (game.height * 0.517) + "px",
						left: (game.width * 0.382) + "px",
						width: (game.width * 0.505)+ "px",
						height: (game.height * 0.032) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#fff",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "1px"
					}
			});

		    var emailInput = Q.createDOM("input"
				, {
					id:"emailInput"
					, type: "text"
					, className: "ui-item"
					, style : {
						position:"absolute",
						top : (game.height * 0.574) + "px",
						left: (game.width * 0.382) + "px",
						width: (game.width * 0.505)+ "px",
						height: (game.height * 0.032) + "px",
						background: "transparent",
						border: "none",
						"text-align": "right",
						"padding-right": "8px",
						"color": "#fff",
						"z-index": 9999,
						"font-size": "18px",
						"letter-spacing": "1px"
					}
			});

			setTimeout(function() {
    			$("body").prepend(nameInput);
    			$("body").prepend(mobileInput);
    			$("body").prepend(idInput);
    			$("body").prepend(emailInput);
    			NProgress.done();
			}, 800);
		} else {
			setTimeout(function() {
				$("#nameInput").show();
				$("#mobileInput").show();
				$("#idInput").show();
				$("#emailInput").show();
				NProgress.done();
			}, 800);
		}

	};

	game.displayPage19 = function() {
		if(this.postSubmitPage == null) {
			this.postSubmitPage = buildBackground("postSubmitPage", "page19");
		}
		
		this.stage.addChild(
					this.postSubmitPage);
		this.stage.step();
	};

	$(function() {
		game.bootstrap();
	});

})();