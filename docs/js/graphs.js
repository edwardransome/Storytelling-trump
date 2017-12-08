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

d3.csv('ndx.csv', function (data) {     
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
    return d3.time.year(d.dd).getFullYear();
});


var yearlyPerformanceGroup = yearlyDimension.group().reduce(
    /* callback for when data is added to the current filter results */
    function (p, v) {
        ++p.count;
        p.absGain += v.close - v.open;
        p.fluctuation += Math.abs(v.close - v.open);
        p.sumIndex += (v.open + v.close) / 2;
        p.avgIndex = p.sumIndex / p.count;
        p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
        p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
        return p;
    },
    /* callback for when data is removed from the current filter results */
    function (p, v) {
        --p.count;
        p.absGain -= v.close - v.open;
        p.fluctuation -= Math.abs(v.close - v.open);
        p.sumIndex -= (v.open + v.close) / 2;
        p.avgIndex = p.count ? p.sumIndex / p.count : 0;
        p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
        p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
        return p;
    },
    /* initialize p */
    function () {
        return {
            count: 0,
            absGain: 0,
            fluctuation: 0,
            fluctuationPercentage: 0,
            sumIndex: 0,
            avgIndex: 0,
            percentageGain: 0
        };
    }
);


    
    