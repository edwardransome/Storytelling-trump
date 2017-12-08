require("dc");
require("crossfilter");

'use strict';

var gainOrLossChart = dc.pieChart('#gain-loss-chart');
var fluctuationChart = dc.barChart('#fluctuation-chart');
var quarterChart = dc.pieChart('#quarter-chart');
var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
var moveChart = dc.lineChart('#monthly-move-chart');
var volumeChart = dc.barChart('#monthly-volume-chart');
var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');
var nasdaqCount = dc.dataCount('.dc-data-count');
var nasdaqTable = dc.dataTable('.dc-data-table');

d3.csv('data/trump.csv', function (data) {
    var dateFormat = d3.time.format('%d-%m-%Y %hh:%mm%ss');
    var numberFormat = d3.format('.2f');

    data.forEach(function (d) {
        d.created_at = dateFormat.parse(d.date);
        d.retweet_count = +d.retweet_count
        d.favorite_count = +d.favorite_count;
    
    });

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var yearlyDimension = ndx.dimension(function (d) {
        return d3.time.year(d.created_at).getFullYear();
    });

    var dateDimension = ndx.dimension(function (d) {
        return d.created_at;
    });


});