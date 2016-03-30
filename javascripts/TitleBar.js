function TitleBar(paper, title) {
   Block.apply(this, arguments);
   this.height = 50;
   this.title = title;
   this.color = "#FFFFFF";
   this.background_color = "#87CEEB";
   this.type = "TitleBar";
}

extend(TitleBar, Block);

TitleBar.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("titlebar");
  this.el.css("height", this.height+"px");
  this.el.css("background-color", this.background_color);
  this.el.css("color", this.color);
  
  this.titleEl = $('<span class="title">'+this.title+'</span>');
  this.contentEl.append(this.titleEl);
};

TitleBar.prototype.update = function() {
  this.titleEl.html(this.title);
  this.el.css("background-color", this.background_color);
  this.el.css("color", this.color);
};