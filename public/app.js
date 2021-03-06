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

		// TODO
		ns.R.init();
		this.startup();
	};

	game.startup = function() {
		if(Q.isWebKit && Q.supportTouch)
		{
			// document.body.style.webkitTouchCallout = "none";
			// document.body.style.webkitUserSelect = "none";
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
		this.stage = new Q.Stage({id: "stage", width:this.width, height:this.height, context:this.context, update:Q.delegate(this.update, this)});

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
		
		ns.history.root("displayPage0");
		ns.history.cleanup = function() {
			game.stage.removeChildById("pickedBag");
		};
		ns.history.push("displayPage0", "#displayPage0");

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
		function render0() {
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
					NProgress.start();
					$.get("/draw/count", {
						"_": Math.random()
					})
					.done(function(resp) {
						NProgress.done();
						if(resp.count === 0) {
							ns.history.push("displayPage1", "#displayPage1");
							game.displayPage1();
						} else {
							alert("您已经领取福袋，快去柜台换领吧！");
						}
					});
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
					NProgress.start();
					$.get("/draw/count", {
						"_": Math.random()
					})
					.done(function(resp) {
						NProgress.done();
						if(resp.count === 0) {
							alert("请先选取福袋！");
						} else {
							window.location = 'exchange.html';
						}
					});
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
					NProgress.start();
					$.get("/draw/count", {
						"_": Math.random()
					})
					.done(function(resp) {
						NProgress.done();
						if(resp.count === 0) {
							alert("请先选取福袋！");
						} else {
							ns.history.push("displayPage3_2", "#displayPage3_2");
							game.displayPage3_2(resp);
						}
					});
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
		}

		ns.R.require('page0', 'button', Q.delegate(render0, this));
	};

	game.displayPage1 = function() {
		function render1() {
			NProgress.start();
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
					game.data.age = $("#ageInput").val();
					ns.history.push("displayPage2", "#displayPage2");
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
						, type: "text"
						, className: "ui-item"
						, style : {
							position:"absolute",
							top : (game.height * 0.678) + "px",
							left: (game.width * 0.573) + "px",
							width: (game.width * 0.175)+ "px",
							height: (game.height * 0.029) + "px",
							background: "transparent",
							border: "none",
							"text-align": "right",
							"padding-right": "6px",
							"color": "#333",
							"z-index": 9999,
							"font-size": Q.isAndroid ? "15px" : "12px",
							"letter-spacing": "3px"
						}
				});
				setTimeout(function() {
	    			$("body").prepend(ageInput);
	    			NProgress.done();

	    			if (window.location.hash !== "#displayPage1") {
	    				$("#ageInput").hide();
	    			}
				}, 800);
			} else {
				setTimeout(function() {
					$("#ageInput").show();
					NProgress.done();

					if (window.location.hash !== "#displayPage1") {
	    				$("#ageInput").hide();
	    			}
				}, 800);
			}
		}

		ns.R.require('page1', 'button', 'checkbox', Q.delegate(render1, this));
	};

	game.displayPage1.cleanup = function() {
		$("#ageInput").hide();
	};

	game.displayPage2 = function() {
		function render2() {
			if(this.pickPage == null) {
				this.pickPage = buildBackground("pickPage", "page2");

				var pickBtnRed1 = new Q.Button({id:"pickBtnRed1", image: ns.R.getImage("pickBagRed1")});
				pickBtnRed1.setUpState({rect:[0,0,225,269]});
				pickBtnRed1.width= 225;
				pickBtnRed1.height = 269;
				pickBtnRed1.scaleX = this.pickPage.scaleX;
				pickBtnRed1.scaleY = this.pickPage.scaleY;
				pickBtnRed1.x = this.width * 0.13;
				pickBtnRed1.y = this.height * 0.33;
				pickBtnRed1.on(game.EVENTS.TAP, function(e) {
					ns.history.push("displayPage3", "#displayPage3");
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
					ns.history.push("displayPage3", "#displayPage3");
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
					ns.history.push("displayPage3", "#displayPage3");
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
					ns.history.push("displayPage3", "#displayPage3");
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
		}

		ns.R.require('page2', 'pickBagRed1', 'pickBagBlue1', 'pickBagRed2', 'pickBagBlue2', Q.delegate(render2, this));
	};

	var inDraw = false;
	game.displayPage3 = function(bag) {

		function render3() {
			if(this.openPage == null) {
				this.openPage = buildBackground("openPage", "page3");

				var openBtn = new Q.Button({id:"openBtn", image: ns.R.getImage("button")});
				openBtn.setUpState({rect:[0,0,390,430]});
				openBtn.width= 390;
				openBtn.height = 430;
				openBtn.scaleX = this.openPage.scaleX;
				openBtn.scaleY = this.openPage.scaleY;
				openBtn.x = this.width * 0.2;
				openBtn.y = this.height * 0.195;
				openBtn.on(game.EVENTS.TAP, function(e) {
					if (!inDraw) {
						inDraw = true;
						NProgress.start();
						$.get("/draw", {
							isMember: game.data.isMember,
							age: $("#ageInput").val()
						}).done(function(resp) {
							inDraw = false;
							NProgress.done();
							if (resp.status === 'ok') {
								if (resp.type === 'gold') {
									ns.history.setGoRootStates(["displayPage3", "displayPage2", "displayPage1"]);
									ns.history.replace("displayPage4", "#displayPage4");
									game.displayPage4(resp.data);
								} else {
									ns.history.setGoRootStates(["displayPage3", "displayPage2", "displayPage1"]);
									ns.history.replace("displayPage5", "#displayPage5");
									game.displayPage5(resp.data);
								}
							} else {
								alert("无法领取优惠券！");						
							}
						});
					}
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
		}

		ns.R.require('page3', 'button', 'pickedRed', 'pickedBlue', Q.delegate(render3, this));
	};

	game.displayPage3_2 = function(resp) {
		function render3_2() {
			if(this.reopenPage == null) {
				this.reopenPage = buildBackground("reopenPage", "page3");

				var reopenBtn = new Q.Button({id:"reopenBtn", image: ns.R.getImage("button")});
				reopenBtn.setUpState({rect:[0,0,390,430]});
				reopenBtn.width= 390;
				reopenBtn.height = 430;
				reopenBtn.scaleX = this.reopenPage.scaleX;
				reopenBtn.scaleY = this.reopenPage.scaleY;
				reopenBtn.x = this.width * 0.2;
				reopenBtn.y = this.height * 0.195;
				reopenBtn.on(game.EVENTS.TAP, function(e) {
					if (resp.count > 1) {
						ns.history.replace("displayPage4", "#displayPage4");
						game.displayPage4(resp.data);
					} else {
						ns.history.replace("displayPage5", "#displayPage5");
						game.displayPage5(resp.data);
					}
				});

				this.reopenBtn = reopenBtn;
			}

			var repickBag = new Q.Bitmap({"id": "repickBag", "image": ns.R.getImage('pickedRed')});
	        repickBag.scaleX = this.reopenPage.scaleX;
	        repickBag.scaleY = this.reopenPage.scaleY;
	        repickBag.x = this.width * 0.25;
	        repickBag.y = this.height * 0.17;

	        this.repickBag = repickBag;
			
			this.stage.addChild(
						this.reopenPage
						, this.repickBag
						, this.reopenBtn);
			this.stage.step();
		}

		ns.R.require('page3', 'button', 'pickedRed', Q.delegate(render3_2, this));
	};

	function selectText(target) {
	}

	game.displayPage4 = function(data) {
		function render4() {
			game.state = "gold";
			NProgress.start();
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
					game.bagParagraph.hide();
					game.couponParagraph.hide();

					ns.history.push("displayPage7", "#displayPage7");
					game.displayPage7('gold');
				});

				this.reserveBtn = reserveBtn;

				var bagParagraph = new ns.Paragraph({
					id: "bagParagraph",
					style: {
						x: 0.45,
						y: 0.395,
						font: "40px arial",
						lineHeight: "35px",
						sX: game.goldPrizePage.scaleX,
						sY: game.goldPrizePage.scaleY
					}
				})

				game.bagParagraph = bagParagraph;

				var couponParagraph = new ns.Paragraph({
					id: "couponParagraph",
					style: {
						x: 0.45,
						y: 0.455,
						font: "40px arial",
						lineHeight: "35px",
						sX: game.goldPrizePage.scaleX,
						sY: game.goldPrizePage.scaleY
					}
				})

				game.couponParagraph = couponParagraph;

				setTimeout(function() {
					game.bagParagraph.text(data.bag);
					game.couponParagraph.text(data.coupon);
					game.bagParagraph.render().hide();
					game.couponParagraph.render().hide();
				}, 900);
			}

			setTimeout(function() {
				if (window.location.hash === "#displayPage4") {
					game.bagParagraph.show();
					game.couponParagraph.show();
    			}

				NProgress.done();
			}, 950);
			
			this.stage.addChild(
						this.goldPrizePage
						, this.reserveBtn);
			this.stage.step();

		}

		ns.R.require('page4', 'button', Q.delegate(render4, this));
	};

	game.displayPage5 = function(data) {
		function render5() {
			game.state = "silver";
			NProgress.start();
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
					game.silverCodeParagraph.hide();

					ns.history.push("displayPage7", "#displayPage7");
					game.displayPage7('silver');
				});

				this.openBtn2 = openBtn2;

				var silverCodeParagraph = new ns.Paragraph({
					id: "silverCodeParagraph",
					style: {
						x: 0.45,
						y: 0.392,
						font: "40px arial",
						lineHeight: "35px",
						sX: game.silverPrizePage.scaleX,
						sY: game.silverPrizePage.scaleY
					}
				})

				game.silverCodeParagraph = silverCodeParagraph;

				setTimeout(function() {
					game.silverCodeParagraph.text(data.coupon);
					game.silverCodeParagraph.render().hide();
				}, 900);
			};
			
			setTimeout(function() {
				if (window.location.hash === "#displayPage5") {
					game.silverCodeParagraph.show();
    			}

				NProgress.done();
			}, 950);

			this.stage.addChild(
						this.silverPrizePage
						, this.openBtn2);
			this.stage.step();
		}

		ns.R.require('page5', 'button', Q.delegate(render5, this));
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

	function searchShop(state, city, bag) {
		if (state === '省份' || city === '城市') {
			alert("请选择省份及城市！");
			return;
		}

		NProgress.start();
		$.get("/shop", {
			"state": state,
			"city": city,
			"_": Math.random()
		}).done(function(resp) {
			NProgress.done();
			ns.history.push("displayPage7Result", "#displayPage7Result");
			game.displayPage7Result(bag, resp.data);
		});
	};

	game.displayPage7 = function(bag) {
		function render7() {
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
					searchShop(stateText.text, cityText.text, bag);
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
		}

		ns.R.require('page71', 'page72', 'button', Q.delegate(render7, this));
	};

	game.displayPage7Result = function(bag, data) {
		function render7Result() {
			if(this.cityResultPage == null) {
				this.cityResultPage = buildBackground("cityResultPage", pickPage(bag, data || {}));

				var resultQueryBtn = new Q.Button({id:"resultQueryBtn", image: ns.R.getImage("button")});
				resultQueryBtn.setUpState({rect:[0,0,390,79]});
				resultQueryBtn.width= 390;
				resultQueryBtn.height = 79;
				resultQueryBtn.scaleX = this.cityResultPage.scaleX;
				resultQueryBtn.scaleY = this.cityResultPage.scaleY;
				resultQueryBtn.x = this.width * 0.2;
				resultQueryBtn.y = this.height * 0.39;
				resultQueryBtn.on(game.EVENTS.TAP, function(e) {
					searchShop(stateResultText.text, cityResultText.text, bag);
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
		}

		ns.R.require('page71', 'page72', 'page712', 'page722', 'button', Q.delegate(render7Result, this));

	};

	$(function() {
		game.bootstrap();
	});

})();