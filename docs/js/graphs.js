var trumpDataTable = dc.dataTable("#data-table");
var trumpTimeChart = dc.lineChart("#dc-trump-time-chart");
var trumpTimeVolumeChart = dc.barChart("#monthly-volume-chart");

d3.json('data/trumptwitterarchive.json', function (data) {
  var dateFormat = d3.time.format('%a %b %d %H:%M:%S %Z %Y');
  var numberFormat = d3.format('.2f');

  var dateFormatSmall = d3.time.format('%a %b %d %H:%M:%S');

  data.forEach(function (d) {
    d.created_at = dateFormat.parse(d.created_at);
  });

  var ndx = crossfilter(data);
  var all = ndx.groupAll();

  var monthDimension = ndx.dimension(function (d) {
    return d3.time.month(d.created_at);
  });

  var monthGroup = monthDimension.group()
    .reduceCount(function (d) {
      return d.created_at;
    });

  var dateDimension = ndx.dimension(function (d) {
    return d.created_at;
  });

  // data table

  trumpDataTable
    .dimension(dateDimension)
    .group(function (d) {
      var format = d3.format('02d');
      return d.created_at.getFullYear() + '-' + d.created_at.getMonth();
    })
    .size(10)
    .columns([
      {
        label: "Creation date",
        format: function (d) {
          var dateFormat = d3.time.format('%a %b %d %H:%M:%S');
          return dateFormat(d.created_at);
        }
      },
      {
        label: "Tweet",
        format: function (d) {
          return d.text;
        }
      },
      {
        label: "Retweet count",
        format: function (d) {
          return d.retweet_count;
        }
      },
      {
        label: "Favorite count",
        format: function (d) {
          return d.favorite_count;
        }
      }
    ])
    .sortBy(function (d) {
      return d.created_at;
    })
    .order(d3.descending)
    .on('renderlet', function (table) {
      table.selectAll('.dc-table-group').classed('info', true);
    });


  // number selected
  dc.dataCount(".data-count")
    .dimension(ndx) // set dimension to all data
    .group(all); // set group to ndx.groupAll()


  //Time chart linked with volume chart
  trumpTimeChart
    .renderArea(true)
    .width(990)
    .height(200)
    .transitionDuration(500)
    .margins({top: 30, right: 50, bottom: 25, left: 40})
    .dimension(monthDimension)
    .group(monthGroup)
    .rangeChart(trumpTimeVolumeChart)
    .brushOn(false)
    .mouseZoomable(true)
    .x(d3.time.scale().domain(d3.extent(data, function (d) {
      return d.created_at;
    })))
    .round(d3.time.month.round)
    .xUnits(d3.time.months)
    .elasticY(true)
    .renderHorizontalGridLines(true)
    .xAxis();

  //Volume chart
  trumpTimeVolumeChart.width(990)
    .height(40)
    .margins({top: 0, right: 50, bottom: 20, left: 40})
    .dimension(monthDimension)
    .group(monthGroup)
    .centerBar(true)
    .gap(1)
    .x(d3.time.scale().domain(d3.extent(data, function (d) {
      return d.created_at;
    })))
    .round(d3.time.month.round)
    .alwaysUseRounding(true)
    .xUnits(d3.time.months);

  dc.renderAll();
  dc.redrawAll();


});