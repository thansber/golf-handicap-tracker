define(
/* Settings */
["jquery", "io"],
function($, IO) {
  var currentYear = -1;
  
  var CURRENT_YEAR_KEY = "GOLF_TRACKER_CURRENT_YEAR";
  
  return {
    getCurrentYear : function() { return currentYear },
    init : function() {
      currentYear = IO.read(CURRENT_YEAR_KEY);
      if (!currentYear) {
        IO.write(CURRENT_YEAR_KEY, new Date().getFullYear());
        currentYear = IO.read(CURRENT_YEAR_KEY);
      }
    }
  };
  
});