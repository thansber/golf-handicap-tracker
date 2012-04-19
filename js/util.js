define( /* Util */
["jquery"], 
function($) {
  
  var compareIntValues = function(valueA, valueB) {
    valueA = "" + valueA;
    valueB = "" + valueB;
    if (valueA.length === 0) {
      valueA = 0;
    }
    if (valueB.length === 0) {
      valueB = 0;
    }
    return parseFloat(valueA) - parseFloat(valueB);
  };
  
  var sortByHandicap = function(a, b) {
    var s = compareIntValues(a.handicap, b.handicap);
    
    if (s === 0) {
      s = compareIntValues(a.index, b.index);
      
      if (s === 0) {
        s = a.name.localeCompare(b.name);
      }
    }
    
    return s;
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