define(
["jquery"],
function($) {
  
  return {
    read : function(key, opt) {
      opt = $.extend({json:false}, opt);
      
      var val = localStorage.getItem(key);
      
      if (opt.json) {
        val = JSON.parse(val);
      }
      return val;
    },
    
    write : function(key, val, opt) {
      opt = $.extend({json:false}, opt);
      
      if (opt.json) {
        val = JSON.stringify(val);
      }
      
      localStorage.setItem(key, val);
    }
  };
});