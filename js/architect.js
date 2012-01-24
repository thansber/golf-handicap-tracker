define(
/* Architect */
["jquery", "io", "settings", "util"],
function($, IO, Settings, Util) {
  
  var $people = null;
  var $peopleHeader = null;
  var $peopleBody = null;
  var $deleteDateSelector = null;
  
  var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  
  var dateToString = function(rawDate) {
    var monthNum = parseInt(rawDate.substr(0, 2) - 1, 10);
    return MONTH_NAMES[monthNum] + " " + rawDate.substr(2);
  };
  
  var getCurrentYearData = function() {
    var data = IO.read(Settings.getCurrentYearDataKey(), {json:true});
    if (data === undefined || data === null) {
      // init dates to [], people to {}
      data = testData();
    }
    return data;
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
  
  var rebuildBody = function(people) {
    $peopleBody = $("<tbody></tbody>");
    appendPeople(people);
    $people.append($peopleBody);
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
  
  var rebuildHeader = function(dates) {
    var $row = $("<tr></tr>");
    $row.append($("<th>Name</th>"));
    $.each(dates, function(i, date) {
      $row.append($("<th>" + dateToString(date) + "</th>"));
    });
    
    $peopleHeader = $("<thead></thead>");
    $peopleHeader.append($row);
    $people.append($peopleHeader);
  };
  
  var setCurrentYearData = function(newData) {
    IO.write(Settings.getCurrentYearDataKey(), newData, {json:true});
  };
  
  var testData = function() {
    return { 
      "dates":["0401","0408","0415","0422"],
      "people":{
        "Hansberger, Debbie":{"scores":["102","109","97", ""]},
        "Hansberger, Jerry":{"scores":["82", "", "91",""]},
        "Cleaves, Mateen":{"scores":["", "112","134","101"]}
      }
    };
  };
  
  
  return {
    appendDeleteDate : appendDeleteDate,
    build : function(opt) {
      opt = $.extend({clear:false}, opt);
      
      var data = getCurrentYearData();
      
      if (opt.clear) {
        $people.empty();
        rebuildHeader(data.dates);
        rebuildBody(data.people);
      }
      
    },
    dateToString : dateToString,
    getCurrentYearData : getCurrentYearData,
    init : function() {
      $people = $("#people");
      $peopleHeader = $people.find("thead");
      $peopleBody = $people.find("tbody");
      $deleteDateSelector = $("#deleteDate");
      
      var $newMonths = $("#newDateMonth");
      $.each(MONTH_NAMES, function(i, monthName) {
        $newMonths.append($("<option></option>").val(Util.pad(i + 1, 2, {ch:"0"})).html(monthName));
      });
      
      rebuildDeleteDates();
    },
    populateDays : populateDays,
    rebuildDeleteDates : rebuildDeleteDates,
    setCurrentYearData : setCurrentYearData
  };
});