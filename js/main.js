require(
["jquery", "architect", "handlers", "settings"], 
function($, Architect, Handlers, Settings) {
    $(document).ready(function() {
      Settings.init();
      Architect.init();
      Handlers.init();
      
      Architect.build({clear:true});      
    });
  }
);