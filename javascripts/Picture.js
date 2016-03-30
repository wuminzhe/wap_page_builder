function Picture(paper, image) {
  Block.apply(this, arguments);
  this.type = "Picture";
  this.image = image;
}

extend(Picture, Block);

Picture.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("picture");
  //
  this.imageEl = $('<img src="'+this.image+'" />');
  this.contentEl.append(this.imageEl);
};

Picture.prototype.update = function() {
  this.imageEl.attr("src", this.image);
}