var dc = require("dc");
var crossfilter = require("crossfilter");
console.log("V " +d3v3.selectAll('#version').text(dc.version));

var trumpDataTable = dc.dataTable(".data-table");


d3v3.json('data/trumptwitterarchive.json', function (data) {
    var dateFormat = d3v3.time.format('%a %b %d %H:%M:%S %Z %Y');
    var numberFormat = d3v3.format('.2f');

    data.forEach(function (d) {
        d.created_at = dateFormat.parse(d.created_at);
    });

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    // var yearlyDimension = ndx.dimension(function (d) {
    //     return d3v3.time.year(d.created_at);
    // });

    var monthDimension = ndx.dimension(function (d) {
        return d3v3.time.month(d.created_at);
    });

    var monthGroup = monthDimension.group()
        .reduceCount(function(d) { return d.created_at; });


    var dateDimension = ndx.dimension(function (d) {
        return d.created_at;
    });

    trumpDataTable
        .dimension(dateDimension)
        .group(function (d){
            var format=d3v3.format('02d');
            return d.created_at.getFullYear() + '-' + d.created_at.getMonth();
        })
        .size(10)
        .columns([
          {
            label: "Creation date",
            format:  function(d) { return d.created_at; }
          },
          {
            label: "Tweet",
            format:  function(d) { return d.text; }
          },
          {
            label: "Retweet count",
            format:  function(d) { return numberFormat( d.retweet_count); }
          },
          {
            label: "Favorite count",
            format:  function(d) { return numberFormat(d.favorite_count);}
          }
        ])
        .sortBy(function(d){
            return d.created_at;
        })
        .order(d3v3.ascending)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

    dc.renderAll();
    dc.redrawAll();


});