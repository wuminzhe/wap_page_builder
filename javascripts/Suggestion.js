function Suggestion(paper) {
  Block.apply(this, arguments);
  this.type = "Suggestion";
}

extend(Suggestion, Block);

Suggestion.prototype.render = function() {
  Block.prototype.render.call(this, arguments);
  this.el.addClass("suggestion");
  
  this.suggestionEl = $('<textarea placeholder="请输入你的意见和建议"/><button class="btn">提交反馈</button>');
  this.contentEl.append(this.suggestionEl);
};