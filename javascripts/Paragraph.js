function Paragraph(paper, text) {
  Block.apply(this, arguments);
  this.text = text;
  this.type = "Paragraph";
  
  //常量
  this.INDENT = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
}

extend(Paragraph, Block);

Paragraph.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("paragraph");
  
  this.textEl = $('<p>'+this.INDENT+this.text+'</p>');
  this.contentEl.append(this.textEl);
};

Paragraph.prototype.update = function() {
  this.textEl.html(this.INDENT+this.text);
};