define(
["jquery"], 
function($) {
  return {
    pad : function(text, len, opt) {
      opt = $.extend({dir:"left", ch:" "}, opt);
      text = "" + text;
      for (var i = 0, n = len - text.length; i < n; i++) {
        text = (opt.dir === "left" ? opt.ch : "") + text + (opt.dir === "right" ? opt.ch : "");
      }
      return text;
    }
  };
});