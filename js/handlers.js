define(
/* Handlers */ 
["jquery", "architect", "dialogs", "settings"], 
function($, Architect, Dialogs, Settings) {
  
  var dialogs = ["settings", "add.date", "delete.date", "add.person", "delete.person", "print", "email"];
  
  var lookupPersonName = function($elem) {
    var $cell = $elem.is("td") ? $elem : $elem.closest("td");
    var $name = $cell.is(".name") ? $cell : $cell.siblings(".name");
    return $name.find("span").text();
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
        if ($cell.is(".editing")) {
          return false;
        }
        
        if ($cell.is(".name") || $cell.is(".handicap") || $cell.is(".index")) {
          $cell.addClass("editing");
          $cell.find("input").focus().select();
        } else if ($target.is("p.flight")) {
          var name = lookupPersonName($target);
          $target.siblings().removeClass("selected");
          $target.addClass("selected");
          Architect.updatePerson(name, {flight:$target.data("index")}, {rebuild:true});
        }
      });
      
      $("#main .people input").live("focusout", function() {
        var $this = $(this);
        var $cell = $this.closest("td");
        var name = lookupPersonName($cell);
        
        if ($cell.is(".name")) {
          Architect.updatePersonName(name, $this.val());
        } else if ($cell.is(".handicap")) {
          Architect.updatePerson(name, {handicap:$this.val()});
        } else if ($cell.is(".index")) {
          Architect.updatePerson(name, {index:$this.val()});
        }
        
        $cell.removeClass("editing");
        $cell.find("span").text($this.val());
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
        else if ($dialog.is(".print")) { Dialogs.print($target); }
        else if ($dialog.is(".email")) { Dialogs.email($target); }
        
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