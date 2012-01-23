define(
/* Architect */
["jquery", "io", "util"],
function($, IO, Util) {
  
  var $people = null;
  var $peopleHeader = null;
  var $peopleBody = null;
  
  var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  var appendPeople = function(people, $tbody) {
    $.each(people, function(name, value) {
      var $row = $("<tr></tr>").addClass("person");
      $row.append($("<td></td>").addClass("name").html(name));
      
      $.each(value.scores, function(i, score) {
        $row.append($("<td></td>").addClass("score").html(score));
      });
      $tbody.append($row);
    });
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
    var $tbody = $("<tbody></tbody>");
    appendPeople(people, $tbody);
    $people.append($tbody);
  };
  
  var rebuildHeader = function(dates) {
    var $row = $("<tr></tr>");
    $row.append($("<th>Name</th>"));
    $.each(dates, function(i, date) {
      var monthNum = parseInt(date.substr(0, 2) - 1, 10);
      $row.append($("<th>" + MONTH_NAMES[monthNum] + " " + date.substr(2) + "</th>"));
    });
    
    var $thead = $("<thead></thead>");
    $thead.append($row);
    $people.append($thead);
  };
  
  
  return {
    build : function(opt) {
      opt = $.extend({clear:false}, opt);
      
      var data = IO.readAll();
      
      if (opt.clear) {
        $people.empty();
        rebuildHeader(data.dates);
        rebuildBody(data.people);
      }
      
    },
    
    init : function() {
      $people = $("#people");
      $peopleHeader = $people.find("thead");
      $peopleBody = $people.find("tbody");
      
      var $newMonths = $("#newDateMonth");
      $.each(MONTH_NAMES, function(i, monthName) {
        $newMonths.append($("<option></option>").val(Util.pad(i + 1, 2, {ch:"0"})).html(monthName));
      });
    },
    
    populateDays : populateDays
  };
});