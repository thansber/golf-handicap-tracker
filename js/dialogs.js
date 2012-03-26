define(
/* Dialogs */ 
["jquery", "architect", "settings", "util"], 
function($, Architect, Settings, Util) {
  
  var buildPeopleByFlight = function() {
    var data = Architect.getCurrentYearData();
    var dateIndex = Architect.getDateIndex(data, Settings.getCurrentDate());
    var flightNames = Settings.getFlightNames();
    
    var peopleByFlight = {};
    
    $.each(data.people, function(name, value) {
      var flight = value.flight[dateIndex];
      var flightName = flight.length === 0 ? "Unassigned" : flightNames[+flight];
      var flightPeople = peopleByFlight[flightName];
      
      if (!flightPeople) {
        flightPeople = [];
        peopleByFlight[flightName] = flightPeople;
      }
      
      flightPeople.push({
        name : name,
        handicap : value.handicap[dateIndex],
        index : value.index[dateIndex]
      });
    });
    
    return peopleByFlight;
  };
  
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
  
  var flightPeopleToMarkup = function(flight, people) {
    var markup = [];
    var m = 0;
    
    if (!people || people.length === 0) {
      return "";
    }
    
    people.sort(Util.sortByHandicap());
    
    markup[m++] = "<table class=\"flight\">";
    markup[m++] = "<thead><tr><th></th><th>" + flight + "</th><th>Index</th><th>Handicap</th></tr></thead>";
    markup[m++] = "<tbody>";
    $.each(people, function(i, person) {
      markup[m++] = "<tr>";
      markup[m++] = "<td class=\"number\">" + (i + 1) + "</td>";
      markup[m++] = "<td class=\"name\">" + person.name + "</td>";
      markup[m++] = "<td class=\"index\">" + person.index + "</td>";
      markup[m++] = "<td class=\"handicap\">" + person.handicap + "</td>";
      markup[m++] = "</tr>";
    });
    markup[m++] = "</tbody>";
    markup[m++] = "</table>";
    
    return markup.join("");
  };
  
  var flightPeopleToText = function(flight, people) {
    var text = [];
    var t = 0;
    var NEWLINE = "\n";
    
    if (!people || people.length === 0) {
      return "";
    }
    
    people.sort(Util.sortByHandicap());
    
    text[t++] = "Flight " + flight;
    text[t++] = "=======" + Util.pad("", flight.length, {ch:"="});
    $.each(people, function(i, person) {
      text[t++] = person.name;
    });
    text[t++] = "";
    text[t++] = "";
    
    return text.join(NEWLINE);
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
  
  var slopeSave = function($button) {
    var rawSlope = $("#slope").val();
    if (rawSlope.length === 0) {
      return "";
    }
    
    var slope = parseInt(rawSlope, 10);
    if (slope === 0) {
      return "";
    }
    
    Settings.setSlope(slope);
    
    $button.closest(".dialog").removeClass("firstTime");
    return "The slope for your home course has been saved as " + slope;
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
    $("#slope").val(Settings.getSlope());
    
    $dialog.find(".message").hide();
  };
  showCallbacks["print"] = function($dialog) {
    var flightNames = Settings.getFlightNames();
    var peopleByFlight = buildPeopleByFlight();
    var $content = $dialog.find(".content");
    var dateHeader = Architect.dateToString(Settings.getCurrentDate()) + ", " + Settings.getCurrentYear();
    
    $content.empty();
    $content.append($("<h2 class=\"title\">Makray Ladies 18 Hole League</h2>"));
    $content.append($("<h2 class=\"date\">" + dateHeader + "</h2>"));
    $content.append($(flightPeopleToMarkup("Unassigned", peopleByFlight["Unassigned"])));
    $.each(flightNames, function(i, name) {
      $content.append($(flightPeopleToMarkup("Flight " + name, peopleByFlight[name])));
    });
    
    $dialog.find(".message").hide();
  };
  showCallbacks["email"] = function($dialog) {
    var peopleByFlight = buildPeopleByFlight();
    var flightNames = Settings.getFlightNames();
    var text = "";
    text += flightPeopleToText("Unassigned", peopleByFlight["Unassigned"]);
    $.each(flightNames, function(i, name) {
      text += flightPeopleToText(name, peopleByFlight[name]);
    });
    
    $("#emailText").text(text);
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
    
    email : function($button) {
      if ($button.is(".select.all")) {
        $("#emailText").focus().select();
      }
    },
    
    hide : function() {
      $("#dialogs").find(".dialog").removeClass("displayed");
      $("body").removeClass("dialog");
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
    
    print : function($button) {
      if ($button.is(".print")) {
        window.print();
      }
    },
    
    settings : function($button) {
      var msg = "";
      if ($button.is(".save.year")) {
        msg = yearSave();
      } else if ($button.is(".save.flights")) {
        msg = numFlightsSave($button);
      } else if ($button.is(".save.slope")) {
        msg = slopeSave($button);
      }
      
      showMessage(msg, $button, "setting");
      rebuild(Architect.getCurrentYearData());
    },
    
    show : function(dialogClass) {
      $("#dialogs").removeClass("hidden");
      $("body").addClass("dialog");
      var $dialog = $("#dialogs").find(".dialog." + dialogClass)
      var displayDialog = function() { $dialog.addClass("displayed"); };
      
      if (showCallbacks[dialogClass]) {
        showCallbacks[dialogClass].call(this, $dialog);
      }
      setTimeout(displayDialog, 20);
    }
  };
});