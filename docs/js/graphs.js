var trumpChart = dc.lineChart("#dc-trump-chart", "chartGroup");
var trumpDataTable = dc.dataTable("#data-table");

d3.json('data/trumptwitterarchive.json', function (data) {
    var dateFormat = d3.time.format('%a %b %d %H:%M:%S %Z %Y');
    var numberFormat = d3.format('.2f');
    data.forEach(function (d) {
        //console.log(d.created_at);
        d.created_at = dateFormat.parse(d.created_at);
        //console.log(d.created_at);    
    });

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    // var yearlyDimension = ndx.dimension(function (d) {
    //     return d3.time.year(d.created_at);
    // });

    var monthDimension = ndx.dimension(function (d) {
        return d3.time.month(d.created_at);
    });

    var monthGroup = monthDimension.group()
        .reduceCount(function(d) { return d.created_at; });


    var dateDimension = ndx.dimension(function (d) {
        return d.created_at;
    });


  trumpDataTable
    .dimension(dateDimension)
    .group(function (d){
      var format=d3.format('02d');
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
        format:  function(d) { return  d.retweet_count; }
      },
      {
        label: "Favorite count",
        format:  function(d) { return d.favorite_count;}
      }
    ])
    .sortBy(function(d){
      return d.created_at;
    })
    .order(d3.descending)
    .on('renderlet', function (table) {
      table.selectAll('.dc-table-group').classed('info', true);
    });



  dc.dataCount("#data-count")
        .dimension(ndx) // set dimension to all data
        .group(all); // set group to ndx.groupAll()

    console.log("Starting chart configuration...");
    trumpChart
        .renderArea(true)
        .width(990)
        .height(200)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(monthDimension)
        .group(function (d) {
            var format = d3.format('02d');
            return d.created_at.getFullYear() + '-' + format((d.created_at.getMonth() + 1));
        })
        .mouseZoomable(true)
        .x(d3.time.scale().domain(d3.extent(data, function(d) {
            return d.created_at;
        })))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .elasticY(true)
        .renderHorizontalGridLines(true);
        
    dc.renderAll();
    dc.redrawAll();


});