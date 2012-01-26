define(
/* Dialogs */ 
["jquery", "architect", "settings"], 
function($, Architect, Settings) {
  
  var dateDelete = function(data) {
    var date = $("#deleteDate").val();
    if (date.length == 0) {
      return false;
    }
    
    var deletePos = $.inArray(date, data.dates);
    data.dates.splice(deletePos, 1);
    
    $.each(data.people, function(i, person) {
      for (var p in person) {
        person[p].splice(deletePos, 1);
      }
    });
    
    return Architect.dateToString(date) + " was deleted";
  };
  
  var dateSave = function(data) {
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
      for (var p in person) {
        person[p].splice(newPos, 0, "");
      }
    });
    
    return Architect.dateToString(newDate) + " was added";
  };
  
  var dateShowCallback = function($dialog) {
    $dialog.find(".currentYear").empty().html(Settings.getCurrentYear());
    $dialog.find(".message").hide();
  };
  
  var numFlightsSave = function($button) {
    var rawNumFlights = $("#numFlights").val();
    if (rawNumFlights.length === 0) {
      return false;
    }
    
    var numFlights = parseInt(rawNumFlights, 10);
    if (numFlights === 0) {
      return false;
    }
    
    Settings.setNumFlights(numFlights);
    
    $button.closest(".dialog").removeClass("firstTime");
    return "The number of flights has been saved as " + numFlights;
  };
  
  var personDelete = function(data) {
    var name = $("#deletePerson").val();
    if (name.length == 0) {
      return false;
    }
    
    delete data.people[name];
    
    return name + " was deleted";
  };
  
  var personSave = function(data) {
    var $input = $("#newPerson");
    var name = $input.val();
    if (name.length == 0) {
      return false;
    }
    
    var emptyData = $.map(data.dates, function() { return ""; });
    
    data.people[name] = {
      handicap : $.merge([], emptyData),
      index : $.merge([], emptyData),
      flight : $.merge([], emptyData)
    };
    
    $input.focus().select();
    return name + " was added";
  };
  
  var rebuild = function(data) {
    Architect.setCurrentYearData(data);
    Architect.build({clear:true});
  };
  
  var showMessage = function(msg, $button, parent) {
    $button.closest(".dialog").find(".message").fadeOut("fast");
    $button.closest(parent ? "." + parent : ".content").find(".message").hide().empty().html(msg).fadeIn("fast");
  };
  
  var yearSave = function() {
    var selectedYear = $("#selectYear").val();
    if (selectedYear.length == 0) {
      return "";
    }
    
    Settings.setCurrentYear(selectedYear);
    return selectedYear + " is set as the current year";
  };
  
  var showCallbacks = {};
  showCallbacks["add.date"] = dateShowCallback;
  showCallbacks["delete.date"] = dateShowCallback;
  showCallbacks["add.person"] = function() { $("#newPerson").val("").focus(); };
  showCallbacks["settings"] = function($dialog) {
    var years = Settings.getAllYears();
    var currentYear = "" + new Date().getFullYear();
    
    if ($.inArray(currentYear, years) == -1) {
      Settings.addYear(currentYear);
      years = Settings.getAllYears();
    }
    
    var $selectYear = $("#selectYear");
    $selectYear.find("option:gt(0)").remove();
    
    $.each(years, function(i, year) {
      var $option = $("<option></option>").val(year).html(year);
      if (year === Settings.getCurrentYear()) {
        $option.attr("selected", "selected");
      }
      $selectYear.append($option);
    });
    
    $("#numFlights").val(Settings.getNumFlights());
    
    $dialog.find(".message").hide();
  };
 
  
  return {
    dates : function($button) {
      var data = Architect.getCurrentYearData();
      var msg = "";
      
      if ($button.is(".save")) {
        msg = dateSave(data);
      } else if ($button.is(".delete")) {
        msg = dateDelete(data);
      }

      showMessage(msg, $button);
      rebuild(data);
      Architect.rebuildDeleteDates({clear:true});
    },
    
    hide : function() {
      $("#dialogs").find(".dialog").removeClass("displayed");
    },
    
    people : function($button) {
      var data = Architect.getCurrentYearData();
      var msg = "";
      
      if ($button.is(".save")) {
        msg = personSave(data);
      } else if ($button.is(".delete")) {
        msg = personDelete(data);
      }

      showMessage(msg, $button);
      rebuild(data);
      Architect.rebuildDeletePeople({clear:true});
    },
    
    settings : function($button) {
      var msg = "";
      if ($button.is(".save.year")) {
        msg = yearSave();
      } else if ($button.is(".save.flights")) {
        msg = numFlightsSave($button);
      }
      
      showMessage(msg, $button, "setting");
      rebuild(Architect.getCurrentYearData());
    },
    
    show : function(dialogClass) {
      $("#dialogs").removeClass("hidden");
      var $dialog = $("#dialogs").find(".dialog." + dialogClass)
      var displayDialog = function() { $dialog.addClass("displayed"); };
      
      if (showCallbacks[dialogClass]) {
        showCallbacks[dialogClass].call(this, $dialog);
      }
      setTimeout(displayDialog, 20);
    }
  };
});