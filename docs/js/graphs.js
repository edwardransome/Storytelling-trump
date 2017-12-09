var dc = require("dc");
var crossfilter = require("crossfilter");

'use strict';

d3v3.json('data/trumptwitterarchive.json', function (data) {
    var dateFormat = d3v3.time.format('%a %b %d %H:%M:%S %Z %Y');
    var numberFormat = d3v3.format('.2f');
    data.forEach(function (d) {
        //console.log(d.created_at);
        d.created_at = dateFormat.parse(d.created_at);
        //console.log(d.created_at);    
    });

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    // var yearlyDimension = ndx.dimension(function (d) {
    //     return d3v3.time.year(d.created_at);
    // });

    var dateDimension = ndx.dimension(function (d) {
        return d.created_at;
    });

    dc.dataTable("#data-table")
        .dimension(dateDimension)
        .group(function (d){
            var format=d3v3.format('02d');
            return d.created_at.getFullYear() + '-' + d.created_at.getMonth();
        })
        .size(10)
        .columns([
            function(d) { return d.source; },
            function(d) { return d.text; },
            function(d) { return d.created_at; },
            function(d) { return d.retweet_count; },
            function(d) { return d.favorite_count; },
            function(d) { return d.is_retweet; },
            function(d) { return d.id_str; }
            
        ])
        .sortBy(function(d){
            return d.created_at;
        })
        .order(d3v3.ascending);
    dc.renderAll();
    dc.redrawAll();

});