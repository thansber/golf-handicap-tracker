define( /* Util */
["jquery"], 
function($) {
  var sortByHandicap = function(a, b) {
    var handicapA = "" + a.handicap;
    var handicapB = "" + b.handicap;
    if (handicapA.length === 0) {
      handicapA = 0;
    }
    if (handicapB.length === 0) {
      handicapB = 0;
    }
    return +handicapA - +handicapB;
  };
  
  return {
    pad : function(text, len, opt) {
      opt = $.extend({dir:"left", ch:" "}, opt);
      text = "" + text;
      for (var i = 0, n = len - text.length; i < n; i++) {
        text = (opt.dir === "left" ? opt.ch : "") + text + (opt.dir === "right" ? opt.ch : "");
      }
      return text;
    },
    
    sortByHandicap : function() {
      return sortByHandicap;
    }
  };
});