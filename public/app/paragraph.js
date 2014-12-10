(function() {
	var ns = Q.use("bag");

	var paragraph = ns.Paragraph = function(option) {
		this.option = option || {};
		this.$ = $("<p />")
			.addClass("ui-item")
			.addClass("ui-paragraph");

		this.$.attr("id", this.option.id);
		this.$.addClass(this.option.class);

		this.$.css({
			"font": this.option.style.font || "32px arial",
			"text-align": this.option.style.textAlign || "start",
			"line-height": this.option.style.lineHeight || "35px",
			"color": this.option.style.color || "#fff",
			"left": ((this.option.style.x * 100) + "%") || "0%",
			"top": ((this.option.style.y * 100) + "%") || "0%",
			"transform": "scale(" + this.option.style.sX + ", " + this.option.style.sY + ")",
			"-webkit-transform": "scale(" + this.option.style.sX + ", " + this.option.style.sY + ")"
		});

		this.$.text(this.option.text);
	};

	paragraph.prototype.render = function() {
		this.$.appendTo("body");
		return this;
	};

	paragraph.prototype.text = function(text) {
		this.$.text(text + "");
		return this;
	}

	paragraph.prototype.hide = function() {
		this.$.hide();
		return this;
	};

	paragraph.prototype.show = function() {
		this.$.show();
		return this;
	};
})();