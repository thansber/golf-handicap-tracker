define(
["jquery"],
function($) {
  
  return {
    read : function(key, opt) {
      opt = $.extend({parseJSON:false}, opt);
      
      var val = localStorage.getItem(key);
      
      if (opt.parseJSON) {
        val = JSON.parse(val);
      }
      return val;
    },
    
    readAll : function() {
   // key = GOLF_TRACKER_DATA_2012
      return { 
        "dates":["0401","0408","0415","0422"],
        "people":{
          "Hansberger, Debbie":{"scores":["102","109","97"]},
          "Hansberger, Jerry":{"scores":["82", "", "91",""]},
          "Cleaves, Mateen":{"scores":["112","134","101"]}
        }
      };
    },
    
    write : function(key, val, opt) {
      opt = $.extend({parseJSON:false}, opt);
      
      if (opt.parseJSON) {
        val = JSON.stringify(val);
      }
      
      localStorage.setItem(key, val);
    }
  };
});