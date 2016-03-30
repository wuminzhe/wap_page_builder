function InfoBar(paper, info) {
   Block.apply(this, arguments);
   this.height = 30;
   this.info = info;
   this.size = 1; // 1em
   this.color = "black";
   this.background_color = "white";
   this.type = "InfoBar";
}

extend(InfoBar, Block);

InfoBar.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("infobar");
  this.el.css("height", this.height+"px");
  this.el.css("background-color", this.background_color);
  this.el.css("color", this.color);
  
  this.infoEl = $('<span class="info">'+this.info+'</span>');
  this.contentEl.append(this.infoEl);
  this.infoEl.css("height", this.height+"px");
  this.infoEl.css("line-height", this.height+"px");
  this.infoEl.css("font-size", this.size+"em");
};

InfoBar.prototype.update = function() {
  this.infoEl.html(this.info);
  this.el.css("background-color", this.background_color);
  this.el.css("color", this.color);
  this.el.css("height", this.height+"px");
  this.infoEl.css("height", this.height+"px");
  this.infoEl.css("line-height", this.height+"px");
  this.infoEl.css("font-size", this.size+"em");
};