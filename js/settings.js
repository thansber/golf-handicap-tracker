define(
/* Settings */
["jquery", "io"],
function($, IO) {
  var allYears = [];
  var currentYear = -1;
  var currentDate = "";
  var numFlights = 0;
  var slope = 0;

  var ALL_KEYS = [];
  var ALL_YEARS_KEY = "GOLF_TRACKER_ALL_YEARS";
  var CURRENT_YEAR_KEY = "GOLF_TRACKER_CURRENT_YEAR";
  var CURRENT_DATE_KEY = "GOLF_TRACKER_CURRENT_DATE";
  var CURRENT_YEAR_DATA_KEY = "GOLF_TRACKER_DATA_";
  var FLIGHT_NAMES_KEY = "GOLF_TRACKER_FLIGHT_NAMES";
  var NUM_FLIGHTS_KEY = "GOLF_TRACKER_NUM_FLIGHTS";
  var SLOPE_KEY = "GOLF_TRACKER_SLOPE";

  var addYear = function(year) {
    allYears.push("" + year);
    allYears.sort().reverse();
    IO.write(ALL_YEARS_KEY, allYears, {json:true});
  };

  var setCurrentYear = function(year) {
    IO.write(CURRENT_YEAR_KEY, "" + year);
    currentYear = IO.read(CURRENT_YEAR_KEY);
  };

  return {
    addYear : addYear,
    defaultFlightNames : function() {
      var names = [];
      // Maybe make this user-editable...
      for (var i = 0; i < numFlights; i++) {
        names.push(String.fromCharCode(65 + i));
      }
      return names;
    },
    dump : function() {
      var allData = {};

      for (var i = 0; i < ALL_KEYS.length; i++) {
        allData[ALL_KEYS[i]] = IO.read(ALL_KEYS[i], {json:ALL_KEYS[i] !== CURRENT_DATE_KEY});
      }
      return JSON.stringify(allData);
    },
    getAllYears : function() { return allYears; },
    getCurrentDate : function() { return currentDate; },
    getCurrentYear : function() { return currentYear; },
    getCurrentYearDataKey : function() { return CURRENT_YEAR_DATA_KEY + currentYear; },
    getFlightNames : function() {
      var names = IO.read(FLIGHT_NAMES_KEY, {json:true});
      if (!names || !names.length) {
        names = this.defaultFlightNames();
      }
      return names;
    },
    getNumFlights : function() { return numFlights; },
    getSlope: function() { return slope; },
    import : function() {
      var data = $("#importData").val();
      if (!data) {
        return;
      }
      var json = JSON.parse(data);
      for (var i = 0; i < ALL_KEYS.length; i++) {
        IO.write(ALL_KEYS[i], json[ALL_KEYS[i]], {json:ALL_KEYS[i] !== CURRENT_DATE_KEY});
      }
    },
    init : function() {
      currentYear = IO.read(CURRENT_YEAR_KEY);
      if (!currentYear) {
        setCurrentYear(new Date().getFullYear());
        addYear(currentYear);
      }

      allYears = IO.read(ALL_YEARS_KEY, {json:true});
      currentDate = IO.read(CURRENT_DATE_KEY);
      numFlights = IO.read(NUM_FLIGHTS_KEY);
      slope = IO.read(SLOPE_KEY);

      allYears = allYears === null ? [] : allYears;
      numFlights = numFlights === null ? 0 : numFlights;
      slope = slope === null ? 0 : slope;

      ALL_KEYS = [ALL_YEARS_KEY, CURRENT_YEAR_KEY, CURRENT_DATE_KEY, NUM_FLIGHTS_KEY, SLOPE_KEY];
      ALL_KEYS.push(CURRENT_YEAR_DATA_KEY + currentYear);
    },
    isSetup : function() { return numFlights > 0 && slope > 0; },
    setCurrentDate : function(date) { IO.write(CURRENT_DATE_KEY, date); currentDate = date; },
    setCurrentYear : setCurrentYear,
    setFlightNames : function(names) { IO.write(FLIGHT_NAMES_KEY, names, {json:true}); },
    setNumFlights : function(n) { IO.write(NUM_FLIGHTS_KEY, n); numFlights = n; },
    setSlope : function(n) { IO.write(SLOPE_KEY, n); slope = n; $("body").trigger("slopechange"); }
  };

});