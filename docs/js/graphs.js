 window.trumpDataTable = dc.dataTable("#data-table");
 window.trumpTimeChart = dc.lineChart("#dc-trump-time-chart");
 window.trumpTimeVolumeChart = dc.barChart("#monthly-volume-chart");
 window.dayOfWeekChart = dc.rowChart("#dc-dayweek-chart");
 window.sourcePie = dc.pieChart("#dc-source-pie-chart");

d3.json('data/trumptwitterarchive.json', function (data) {
  var dateFormat = d3.time.format('%a %b %d %H:%M:%S %Z %Y');
  var numberFormat = d3.format('.2f');

  var dateFormatSmall = d3.time.format('%B %Y');

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
    var dayOfWeek = ndx.dimension(function(d) {
      var day = d.created_at.getDay();
      switch(day){
      case 0: 
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      }
    });
    var dayOfWeekGroup = dayOfWeek.group();
    
    var sourceDimension = ndx.dimension(function(d){
      switch(d.source){
        case "Twitter for Android":
          return "Android";
        case "Twitter Web Client":
          return "Web Client";
        case "Twitter for iPhone":
          return "iPhone";
        default:
          return d.source;
      }
    });
    var sourceGroup = sourceDimension.group();

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
      return d.retweet_count;
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
    .title(function(d){

      return dateFormatSmall(d.key)+"\nNumber of tweets : "+d.value;})
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

  //Day of week chart
  dayOfWeekChart
    .width(300)
    .height(300)
    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(dayOfWeek)
    .group(dayOfWeekGroup)
    .colors(d3.scale.category10())
    .label(function(d){
      return d.key;
    })
    .elasticX(true)
    .xAxis().ticks(4);

  //source chart
  sourcePie.width(300)
    .height(300)
    .radius(100)
    .innerRadius(30)
    .dimension(sourceDimension)
    .title(function(d){
      var label = d.key;
      if (all.value()) {
        label += ' (' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label +"\nNumber of tweets : "+d.value;})
    .group(sourceGroup);

  dc.renderAll();
  dc.redrawAll();



});