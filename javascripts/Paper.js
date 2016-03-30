function Paper() {
  this.paperEl = $(".paper");
  this.el = $('<div class="blocks"></div>');
  this.paperEl.append(this.el);
  this.blockId = 0;
  this.blocks = [];
  this.selectedBlock = null;
}

Paper.prototype.getBlockId = function() {
  return "b"+this.blockId++;
};

Paper.prototype.getBlockById = function(id) {
  for( var i=0; i<this.blocks.length; i++ ) {
    var block = this.blocks[i];
    if( block.id == id ) {
      return block;
    }
  }
  return null;
};

Paper.prototype.render = function() {
  for( var i=0; i<this.blocks.length; i++ ) {
    var block = this.blocks[i];
    if( block.rendered==false ) {
      block.render();
    } else {
      block.el.appendTo(this.el);
      block.el.css("top", "");
    }
  }
  
  
  
};

Paper.prototype._adjustDropline = function() {
  for( var i=0; i<this.blocks.length; i++ ) {
    var block = this.blocks[i];
    //调整dropline的位置
    var blockNext = null;
    if( i<this.blocks.length-1 ) { //非最后一个
      blockNext = this.blocks[i+1];
    }
    if( blockNext ) {
      var height = block.el.height()/2 + blockNext.el.height()/2;
      var top = block.el.height()/2;
      block.dropEl.css({
        "height": height+"px",
        "top": top+"px"
      });
    }
  }
};

//将block移动到或者加到target下面
Paper.prototype.moveOrAdd = function(block, targetBlock) {
  var oldIndex = _.indexOf(this.blocks, block);
  var indexOfThis = _.indexOf(this.blocks, targetBlock);
  if( oldIndex<=indexOfThis) {
    var newIndex = indexOfThis;
  } else {
    var newIndex = indexOfThis + 1;
  }
  this.blocks = move(this.blocks, oldIndex, newIndex);
  
  this.render();
  
  this.selectBlock(block);
};

Paper.prototype.selectBlock = function(block) {
  if( block ) {
    if( this.selectedBlock ) {
      this.selectedBlock.el.removeClass("selected");
      this.selectedBlock = null;
    }
   
    this.selectedBlock = block; 
    this.selectedBlock.el.addClass("selected");
  
    //
    if( block.clicked ) {
      block.clicked(block);
    }
  }
  
  
};

Paper.prototype.deleteBlock = function(block) {
  if( block==this.selectedBlock ) {
    this.selectedBlock = null;
  }
  block.delete();
  this.blocks = _.without( this.blocks, block );
};

Paper.prototype.addBlock = function() {
  var block = new Block(this);
  this.blocks.push(block);
};

Paper.prototype.addGutter = function() {
  var gutter = new Gutter(this);
  this.blocks.push(gutter);
  return gutter;
};

Paper.prototype.addPicture = function(image) {
  var picture = new Picture(this, image);
  this.blocks.push(picture);
  return picture
};

Paper.prototype.addInfoBar = function(info) {
  var infoBar = new InfoBar(this, info);
  this.blocks.push(infoBar);
  return infoBar;
};

Paper.prototype.addTitleBar = function(title) {
  var titleBar = new TitleBar(this, title);
  this.blocks.push(titleBar);
  return titleBar;
};

Paper.prototype.addParagraph = function(text) {
  var paragraph = new Paragraph(this, text);
  this.blocks.push(paragraph);
  return paragraph;
};

Paper.prototype.addSuggestion = function() {
  var s = new Suggestion(this);
  this.blocks.push(s);
  return s;
};

Paper.prototype.addImageParagraph = function(text, image, float) {
  var paragraph = new ImageParagraph(this, text, image, float);
  this.blocks.push(paragraph);
  return paragraph;
};

Paper.prototype.addImageSlider = function(images) {
  var slider = new ImageSlider(this, images);
  this.blocks.push(slider);
  return slider;
}