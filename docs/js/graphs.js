var trumpDataTable = dc.dataTable("#data-table");
var trumpChart = dc.lineChart("#dc-trump-chart");
var dayOfWeekChart = dc.rowChart("#dc-dayweek-chart");
var sourcePie = dc.pieChart("#dc-pie-chart");

d3.json('data/trumptwitterarchive.json', function (data) {
    var dateFormat = d3.time.format('%a %b %d %H:%M:%S %Z %Y');
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



  // number selected
  dc.dataCount(".data-count")
        .dimension(ndx) // set dimension to all data
        .group(all); // set group to ndx.groupAll()

  //Time chart
    console.log("Starting chart configuration...");
    trumpChart
        .renderArea(true)
        .width(990)
        .height(200)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(monthDimension)
        .group(monthGroup)
        .mouseZoomable(true)
        .x(d3.time.scale().domain(d3.extent(data, function(d) {
            return d.created_at;
        })))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .elasticY(true)
        .renderHorizontalGridLines(true);

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

    sourcePie.width(300)
    .height(300)
    .radius(100)
    .innerRadius(30)
    .dimension(sourceDimension)
    .title(function(d){return d.value;})
    .group(sourceGroup);


    dc.renderAll();
    dc.redrawAll();


});