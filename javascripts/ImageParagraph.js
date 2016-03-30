function ImageParagraph(paper, text, image, float) {
  Block.apply(this, arguments);
  this.type = "ImageParagraph";
  this.text = text;
  this.image = image;
  this.float = float ? float : "left";
  
  //常量
  this.INDENT = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
}

extend(ImageParagraph, Block);

ImageParagraph.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("image-paragraph");
  //
  this.imageEl = $('<img src="'+this.image+'" />');
  this.contentEl.append(this.imageEl);
  this.imageEl.css({
    "float": this.float
  });
  if( this.float=="left" ) {
    this.imageEl.css({
      "margin-right": "5px"
    });
  } else if( this.float=="right" ) {
    this.imageEl.css({
      "margin-left": "5px"
    });
  }
  
  this.imageEl.width(this.imageEl.width());
  //
  this.textEl = $('<p>'+this.INDENT+this.text+'</p>');
  this.contentEl.append(this.textEl);
};

ImageParagraph.prototype.update = function() {
  this.textEl.html(this.INDENT+this.text);
  this.imageEl.attr("src", this.image);
}