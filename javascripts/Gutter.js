function Gutter(paper) {
  Block.apply(this, arguments);
  this.type = "Gutter";
}

extend(Gutter, Block);

Gutter.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("gutter");
  
  this.contentEl.html('<div style="text-align:center;color:lightgrey;line-height: 20px"></div>');
};