require(
["jquery", "architect", "io", "settings"], 
function($, Architect, IO, Settings) {
    $(document).ready(function() {
      Settings.init();
      Architect.init();
  
      $("#menu").click(function() {
        $(this).toggleClass("show");
      });
      
      $("#newDateMonth").change(function() {
        Architect.populateDays();
      });
      
      Architect.build({clear:true});
    });
  }
);