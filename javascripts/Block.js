function Block(paper) {
  this.paper = paper;
  this.id = this.paper.getBlockId();
  this.type = "Block";
  this.rendered = false;
}

Block.prototype.render = function() {
  this.rendered = true;
  this.el = $('<div id="'+this.id+'" />');
  this.el.addClass("block");
  this.el.draggable({ 
    axis: "y", 
    revert: "invalid", 
    opacity: 0.35,
    distance: 10
  });
  this.paper.el.append(this.el);
  var _this = this;
  
  //content element
  this.contentEl = $('<div class="content"></div>');
  this.el.append(this.contentEl);
  this.el.mouseenter(function(){
    _this.deleteEl.css("display", "block");
  });
  this.el.mouseleave(function(){
    _this.deleteEl.css("display", "none");
  });
  
  
  //
  
  this.dropEl = $('<div class="dropline"></div>');
  this.dropEl.droppable({ 
    accept: ".block, .template", 
    activeClass: "highlight", 
    hoverClass: "hover", 
    tolerance: "pointer", //intersect
    drop: function( event, ui ) {
      if( ui.draggable.hasClass("block") ) {
        
        var block = _this.paper.getBlockById(ui.draggable.attr("id"));
        
      } else if( ui.draggable.hasClass("template") ) {
  
        var block = _this._createByTemplate(ui.draggable.attr("template"));
        
      }
      
      if( block ) {
        _this.paper.moveOrAdd(block, _this);
      }
      
    }
  
  });
  this.el.append(this.dropEl);
  
  this.el.click(function(e){
    _this.paper.selectBlock(_this);
    e.stopPropagation();
  });
  
  //cover element
  this.deleteEl = $('<div class="delete"><img src="./images/delete.png"></img></div>');
  this.el.append(this.deleteEl);
  this.deleteEl.click(function(e){
    if( confirm("确定删除？") ) {
      _this.paper.deleteBlock(_this);
    }
    e.stopPropagation();
  });
};

Block.prototype._createByTemplate = function(templateName) {
  var block = null;
  var lorem = "道可道，非常道。名可名，非常名。无名天地之始。有名万物之母。故常无欲，以观其妙。常有欲以观其徼。此两者同出而异名，同谓之玄。玄之又玄，众妙之门。天地不仁，以万物为刍狗。圣人不仁，以百姓为刍狗。天地之间，其犹橐迭乎？虚而不屈，动而愈出。多言数穷，不如守中。";
  if( templateName=="TitleBar" ){
    block = this.paper.addTitleBar("标题");
  } else if( templateName=="RightImageParagraph" ) {
    block = this.paper.addImageParagraph(lorem, "./images/girl.jpg", "right");
  } else if( templateName=="LeftImageParagraph" ) {
    block = this.paper.addImageParagraph(lorem, "./images/girl.jpg", "left");
  } else if( templateName=="Paragraph" ) {
    block = this.paper.addParagraph(lorem);
  } else if( templateName=="Gutter" ){
    block = this.paper.addGutter();
  } else if( templateName=="Picture" ){
    block = this.paper.addPicture("./images/img.jpg");
  } else if( templateName=="ImageSlider" ){
    block = this.paper.addImageSlider(["./images/img1.jpg", "./images/img2.jpg", "./images/img3.jpg"]);
  } else if( templateName=="InfoBar" ){
    block = this.paper.addInfoBar("江苏省人民政府");
  }
  
  return block;
};

Block.prototype.delete = function() {
  this.el.remove();
};