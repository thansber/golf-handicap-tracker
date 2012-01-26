define(
/* Architect */
["jquery", "io", "settings", "util"],
function($, IO, Settings, Util) {
  
  var $people = null;
  var $peopleHeader = null;
  var $peopleBody = null;
  var $deleteDateSelector = null;
  var $deletePeopleSelector = null;
  
  var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  var appendDeleteDate = function(date, opt) {
    opt = $.extend({sort:false}, opt);
    var newOption = $("<option></option>").val(date).html(dateToString(date));
    if (opt.sort) {
      var existing = $.makeArray($deleteDateSelector.find("option"));
      existing.push(newOption);
      existing.sort(function(a, b) {
        return a.value > b.value ? 1 : -1;
      });
    } else {
      $deleteDateSelector.append(newOption);
    }
  };
  
  var appendPeople = function(people) {
    $.each(people, function(name, value) {
      var $row = $("<tr></tr>").addClass("person");
      $row.append($("<td></td>").addClass("name").html(name));
      
      $.each(value.scores, function(i, score) {
        $row.append($("<td></td>").addClass("score").html(score));
      });
      $peopleBody.append($row);
    });
  };
  
  var buildFlights = function(flightStr) {
    var flights = [];
    var f = 0;
    var numFlights = Settings.getNumFlights();
    var flightNames = Settings.getFlightNames();
    var flight = flightStr.length === 0 ? -1 : +flightStr;
    
    for (var i = 0; i < numFlights; i++) {
      flights[f++] = "<p class=\"flight";
      if (flight === i) {
        flights[f++] = " selected";
      }
      flights[f++] = "\" data-index=\"";
      flights[f++] = i;
      flights[f++] = "\">";
      flights[f++] = flightNames[i];
      flights[f++] = "</p>";
    }
    
    return flights.join("");
  };
  
  var dateToString = function(rawDate) {
    var monthNum = parseInt(rawDate.substr(0, 2) - 1, 10);
    return MONTH_NAMES[monthNum] + " " + parseInt(rawDate.substr(2), 10);
  };
  
  var getCurrentYearData = function() {
    var data = IO.read(Settings.getCurrentYearDataKey(), {json:true});
    if (data === undefined || data === null) {
      // init dates to [], people to {}
      data = testData();
    }
    return data;
  };
  
  var getDateIndex = function(data, date) {
    return $.inArray(date, data.dates);
  };
  
  var populateDays = function() {
    var $newDays = $("#newDateDay");
    var selectedMonth = $("#newDateMonth").val();
    $newDays.find("option:gt(0)").remove();
    
    if (selectedMonth.length > 0) {
      var numDays = DAYS_IN_MONTH[parseInt(selectedMonth, 10) - 1];
      for (var i = 1; i <= numDays; i++) {
        $newDays.append($("<option></option>").val(Util.pad(i, 2, {ch:"0"})).html(i));
      }
    }
  };
  
  var rebuildDateList = function() {
    var data = getCurrentYearData();
    var currentDate = Settings.getCurrentDate();
    
    $("#currentYear").empty().html(Settings.getCurrentYear());
    var $dateList = $("#main").find(".dateList");
    var $selectedDate = null;
    $dateList.empty();
    $.each(data.dates, function(i, date) {
      var $date = $("<li>" + dateToString(date) + "</li>").data("date", date);
      if (date === currentDate) {
        $selectedDate = $date;
      }
      $dateList.append($date);
    });
    
    if ($selectedDate && $selectedDate.length > 0) {
      $selectedDate.click();
    }
  };
  
  var rebuildDeleteDates = function(opt) {
    opt = $.extend({clear:false}, opt);
    var data = getCurrentYearData();
    
    if (opt.clear) {
      $deleteDateSelector.find("option:gt(0)").remove();
    }
    
    $.each(data.dates, function(i, date) {
      $deleteDateSelector.append($("<option></option>").val(date).html(dateToString(date)));
    });
  };
  
  var rebuildDeletePeople = function(opt) {
    opt = $.extend({clear:false}, opt);
    var data = getCurrentYearData();
    
    if (opt.clear) {
      $deletePeopleSelector.find("option:gt(0)").remove();
    }
    
    var sortedNames = $.map(data.people, function(value, name) { return name; });
    sortedNames.sort();
    $.each(sortedNames, function(i, name) {
      $deletePeopleSelector.append($("<option></option>").val(name).html(name));
    })
  };
  
  var rebuildScoreData = function() {
    var data = getCurrentYearData();
    var date = Settings.getCurrentDate();
    var dateIndex = getDateIndex(data, date);
    
    $("#main .tableheader").empty().html(dateToString(date) + ", " + Settings.getCurrentYear());
    
    $peopleBody.empty();
    
    var rows = [];
    var r = 0;
    $.each(data.people, function(name, value) {
      rows[r++] = "<tr class=\"person\">";
      var $row = $("<tr></tr>").addClass("person");
      var handicap = dateIndex == -1 ? "" : value.handicap[dateIndex];
      var index = dateIndex == -1 ? "" : value.index[dateIndex];
      var flight = dateIndex == -1 ? "" : value.flight[dateIndex];
      
      rows[r++] = "<td class=\"name\">";
      rows[r++] = "<span>" + name + "</span>";
      rows[r++] = "<input type=\"text\" value=\"" + name + "\" />";
      rows[r++] = "</td>";
      
      rows[r++] = "<td class=\"handicap\">";
      rows[r++] = "<span>" + handicap + "</span>";
      rows[r++] = "<input type=\"text\" value=\"" + handicap + "\" />";
      rows[r++] = "</td>";
      
      rows[r++] = "<td class=\"index\">";
      rows[r++] = "<span>" + index + "</span>";
      rows[r++] = "<input type=\"text\" value=\"" + index + "\" />";
      rows[r++] = "</td>";
      
      rows[r++] = "<td class=\"flight\">";
      rows[r++] = buildFlights(flight);
      rows[r++] = "</td>";
      
      rows[r++] = "</tr>";
    });
    
    $peopleBody.append($(rows.join("")));
  };
  
  var setCurrentYearData = function(newData) {
    IO.write(Settings.getCurrentYearDataKey(), newData, {json:true});
  };
  
  var testData = function() {
    return { 
      "dates":["0401","0408","0415","0422"],
      "people":{
        "Hansberger, Debbie":{
          "handicap":["28","30","29","29"],
          "index":["24.8","27.3","25.7","25.4"],
          "flight":["2","2","2","2"]
        },
        "Hansberger, Jerry":{
          "handicap":["13", "", "15",""],
          "index":["11.2","","14.9",""],
          "flight":["1","","2","1"]
        },
        "Cleaves, Mateen":{
          "handicap":["", "35","35","35"],
          "index":["","31.6","31.8","31.7"],
          "flight":["3","3","3","3"]
        }
      }
    };
  };
  
  var updatePerson = function(name, change, opt) {
    opt = $.extend({rebuild:false}, opt);
    var data = getCurrentYearData();
    var date = Settings.getCurrentDate();
    var index = getDateIndex(data, date);
    
    var person = data.people[name];
    for (var p in person) {
      if (change[p] !== undefined && change[p] !== null) {
        person[p][index] = "" + change[p];
      }
    }
    
    setCurrentYearData(data);
    
    if (opt.rebuild) {
      rebuildScoreData();
    }
  };
  
  var updatePersonName = function(name, newName) {
    var data = getCurrentYearData();
    var personData = data.people[name];
    data.people[newName] = $.extend(true, {}, personData);
    delete data.people[name];
    setCurrentYearData(data);
  };
  
  return {
    appendDeleteDate : appendDeleteDate,
    build : function(opt) {
      opt = $.extend({clear:false}, opt);
      
      if (opt.clear) {
        rebuildDateList();
      }
    },
    dateToString : dateToString,
    getCurrentYearData : getCurrentYearData,
    init : function() {
      $people = $("#main .people");
      $peopleBody = $people.find("tbody");
      $deleteDateSelector = $("#deleteDate");
      $deletePeopleSelector = $("#deletePerson");
      
      var $newMonths = $("#newDateMonth");
      $.each(MONTH_NAMES, function(i, monthName) {
        $newMonths.append($("<option></option>").val(Util.pad(i + 1, 2, {ch:"0"})).html(monthName));
      });
      
      rebuildDeleteDates();
      rebuildDeletePeople();
    },
    populateDays : populateDays,
    rebuildDeleteDates : rebuildDeleteDates,
    rebuildDeletePeople : rebuildDeletePeople,
    rebuildScoreData : rebuildScoreData,
    setCurrentYearData : setCurrentYearData,
    updatePerson : updatePerson,
    updatePersonName : updatePersonName
  };
});