define(
/* Handlers */ 
["jquery", "architect", "dialogs", "settings"], 
function($, Architect, Dialogs, Settings) {
  
  var dialogs = ["settings", "add.date", "delete.date", "add.person", "delete.person"];
  
  var lookupPersonName = function($elem) {
    var $cell = $elem.is("td") ? $elem : $elem.closest("td");
    var $name = $cell.siblings(".name");
    return $name.text();
  };
  
  return {
    init : function() {
      
      $("#main button").click(function(e) {
        var $target = $(e.target);
        
        $.each(dialogs, function(i, dialogClass) {
          if ($target.is("." + dialogClass)) {
            Dialogs.show(dialogClass);
          }
        });
        
        return false;
      });
      
      $("#main .dateList").click(function(e) {
        var $target = $(e.target);
        
        if ($target.is("li")) {
          $target.siblings().removeClass("selected");
          $target.addClass("selected");
          Settings.setCurrentDate($target.data("date"));
          Architect.rebuildScoreData();
        }
      });
      
      $("#main .people").click(function(e) {
        var $target = $(e.target);
        var $cell = $target.is("td") ? $target : $target.closest("td");
        if ($cell.is(".name")) {
          console.log("editing name");
        } else if ($cell.is(".handicap")) {
          console.log("editing handicap");
        } else if ($cell.is(".index")) {
          console.log("editing index");
        } else if ($target.is("p.flight")) {
          var name = lookupPersonName($target);
          $target.siblings().removeClass("selected");
          $target.addClass("selected");
          Architect.updatePerson(name, {flight:$target.data("index")});
        }
      });
      
      $("#menu").click(function() {
        $(this).toggleClass("show");
        return false;
      });
      
      $("#newDateMonth").change(function() {
        Architect.populateDays();
      });
      
      $("#menu .options").click(function(e) {
        var $target = $(e.target);
        
        $.each(dialogs, function(i, dialogClass) {
          if ($target.is("." + dialogClass)) {
            Dialogs.show(dialogClass);
          }
        });
        
        return false;
      });
      
      $("#dialogs .close").click(function() {
        Dialogs.hide();
        return false;
      });
      
      $("#dialogs button").click(function(e) {
        var $target = $(e.target);
        var $dialog = $target.closest("section");
        
        if ($dialog.is(".date")) { Dialogs.dates($target); }
        else if ($dialog.is(".person")) { Dialogs.people($target); }
        else if ($dialog.is(".settings")) { Dialogs.settings($target); }
        
        return false;
      });
      
      $("#dialogs .dialog").on("transitionend webkitTransitionEnd", function() {
        if ($(this).is(":not(.displayed)")) {
          $("#dialogs").addClass("hidden");
        }
      });
    }
  };
});