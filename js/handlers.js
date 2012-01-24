define(
/* Handlers */ 
["jquery", "architect"], 
function($, Architect) {
  
  var dateDialogButtonHandler = function($dialog, $button) {
    var data = Architect.getCurrentYearData();
    var msg = "";
    
    if ($button.is(".save")) {
      var month = $("#newDateMonth").val();
      var day = $("#newDateDay").val();
      if (month.length == 0 || day.length == 0) {
        return false;
      }
      
      var newDate = month + day;
      data.dates.push(newDate);
      data.dates.sort();
      
      var newPos = $.inArray(newDate, data.dates);
      $.each(data.people, function(i, person) {
        person.scores.splice(newPos, 0, "");
      });
      
      msg = Architect.dateToString(newDate) + " was added";
    } else if ($button.is(".delete")) {
      var date = $("#deleteDate").val();
      if (date.length == 0) {
        return false;
      }
      
      var deletePos = $.inArray(date, data.dates);
      data.dates.splice(deletePos, 1);
      
      $.each(data.people, function(i, person) {
        person.scores.splice(deletePos, 1);
      });
      
      msg = Architect.dateToString(date) + " was removed";
    }

    $button.closest(".option").find(".message").empty().html(msg);
    Architect.setCurrentYearData(data);
    Architect.rebuildDeleteDates({clear:true});
    Architect.build({clear:true});
  };
  
  return {
    init : function() {
      $("#menu").click(function() {
        $(this).toggleClass("show");
        return false;
      });
      
      $("#newDateMonth").change(function() {
        Architect.populateDays();
      });
      
      $("#menu .options").click(function(e) {
        var $target = $(e.target);
        
        if ($target.is(".dates")) {
          $("#dialogs").removeClass("hidden");
        }
        
        
        return false;
      });
      
      $("#dialog button").click(function(e) {
        var $target = $(e.target);
        var $dialog = $target.closest("section");
        
        if ($dialog.is(".dates")) { dateDialogButtonHandler($dialog, $target); }
        
        return false;
      });
    }
  };
});