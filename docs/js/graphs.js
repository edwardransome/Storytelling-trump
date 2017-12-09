var dc = require("dc");
var crossfilter = require("crossfilter");

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

d3v3.json('data/trumptwitterarchive.json', function (data) {
    var dateFormat = d3v3.time.format('%d-%m-%Y %H:%M:%S');
    var numberFormat = d3v3.format('.2f');
    data.forEach(function (d) {
        //console.log(d.created_at);
        d.created_at = dateFormat.parse(d.created_at);
        //console.log(d.created_at);    
    });

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var yearlyDimension = ndx.dimension(function (d) {
        return d3v3.time.year(d.created_at).getFullYear();
    });

    var dateDimension = ndx.dimension(function (d) {
        return d.created_at;
    });

    nasdaqTable
        .dimension(dateDimension)
        .group(function (d){
            var format=d3v3.format('02d');
            return d.created_at.getFullYear() + '-' + d.created_at.getMonth();
        })
        .size(10)
        .sortBy(function(d){
            return d.created_at;
        })
        .order(d3v3.ascending)
        .on('renderlet', function(table){
            table.selectAll('.dc-table-group').classed('info', true);
        })
});