function ImageSlider(paper, images) {
  Block.apply(this, arguments);
  this.type = "ImageSlider";
  this.images = images;
}

extend(ImageSlider, Block);

ImageSlider.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("imageslider");
  var slideId = this.id+"_slider"
  var sliderHtml = 
  '<div id="'+slideId+'" class="slider">' +
    '<div class="slider-wrap">';
  for( var i=0; i<this.images.length; i++ ) {
    var image = this.images[i];
    sliderHtml = sliderHtml + 
        '<div><img src="'+image+'"></div>';
  }
  sliderHtml = sliderHtml + 
    '</div>';
	
  
  sliderHtml = sliderHtml + 
    '<nav>' + 
      '<ul class="position">' +
        '<li class="on"></li>' +
        '<li></li>' +
        '<li></li>' +
      '</ul>' +
    '</nav>';
  sliderHtml = sliderHtml + 
  '</div>';
  
  this.sliderEl = $(sliderHtml);
  this.contentEl.append(this.sliderEl);
  
  var bullets = $('.position')[0].getElementsByTagName('li');
  var slider = DragSlide(document.getElementById(slideId), {
      auto: 5000,
      continuous: true,
      callback: function(pos) {
        var i = bullets.length;
        while (i--) {
            bullets[i].className = ' ';
        }
        bullets[pos].className = 'on';
      }
  });
   
};

ImageSlider.prototype.update = function() {
  var _this = this;
  this.sliderEl.find("img").each(function( index ) {
    $(this).attr("src", _this.images[index]);
  });
}

