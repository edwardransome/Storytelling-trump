window.trumpDataTable = dc.dataTable('#data-table');
window.trumpTimeChart = dc.lineChart('#dc-trump-time-chart');
window.trumpTimeVolumeChart = dc.barChart('#monthly-volume-chart');
window.dayOfWeekChart = dc.rowChart('#dc-dayweek-chart');
window.sourcePie = dc.pieChart('#dc-source-pie-chart');

d3.json('data/trumptwitterarchive.json', (data) => {
  const dateFormat = d3.time.format('%a %b %d %H:%M:%S %Z %Y');

  const dateFormatSmall = d3.time.format('%B %Y');

  data.forEach((d) => {
    d.created_at = dateFormat.parse(d.created_at);
  });

  const ndx = crossfilter(data);
  const all = ndx.groupAll();

  const monthDimension = ndx.dimension(d => d3.time.month(d.created_at));

  const monthGroup = monthDimension.group()
    .reduceCount(d => d.created_at);

  // data table
  const dayOfWeek = ndx.dimension((d) => {
    const day = d.created_at.getDay();
    switch (day) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        return 'Not a day';
    }
  });
  const dayOfWeekGroup = dayOfWeek.group();

  const sourceDimension = ndx.dimension((d) => {
    switch (d.source) {
      case 'Twitter for Android':
        return 'Android';
      case 'Twitter Web Client':
        return 'Web Client';
      case 'Twitter for iPhone':
        return 'iPhone';
      default:
        return d.source;
    }
  });
  const sourceGroup = sourceDimension.group();

  const retweetDimension = ndx.dimension(d => d.retweet_count);

  // data table
  trumpDataTable
    .dimension(retweetDimension)
    .group(d => 'Most retweeted')
    .size(10)
    .columns([
      {
        label: 'Creation date',
        format(d) {
          const dateFormatTable = d3.time.format('%a %b %d %H:%M:%S');
          return dateFormatTable(d.created_at);
        },
      },
      {
        label: 'Tweet',
        format(d) {
          return d.text;
        },
      },
      {
        label: 'Retweet count',
        format(d) {
          return d.retweet_count;
        },
      },
      {
        label: 'Favorite count',
        format(d) {
          return d.favorite_count;
        },
      },
    ])
    .sortBy(d => d.retweet_count)
    .order(d3.descending)
    .on('renderlet', (table) => {
      table.selectAll('.dc-table-group').classed('info', true);
    });


  // number selected
  dc.dataCount('.data-count')
    .dimension(ndx) // set dimension to all data
    .group(all); // set group to ndx.groupAll()


  // Time chart linked with volume chart
  trumpTimeChart
    .renderArea(true)
    .width(990)
    .height(250)
    .transitionDuration(500)
    .margins({
      top: 30, right: 50, bottom: 25, left: 40,
    })
    .dimension(monthDimension)
    .group(monthGroup)
    .rangeChart(trumpTimeVolumeChart)
    .brushOn(false)
    .mouseZoomable(true)
    .x(d3.time.scale().domain(d3.extent(data, d => d.created_at)))
    .round(d3.time.month.round)
    .xUnits(d3.time.months)
    .elasticY(true)
    .renderHorizontalGridLines(true)
    .title(d => `${dateFormatSmall(d.key)}\nNumber of tweets : ${d.value}`)
    .xAxis();

  // Volume chart
  trumpTimeVolumeChart.width(990)
    .height(40)
    .margins({
      top: 0, right: 50, bottom: 20, left: 40,
    })
    .dimension(monthDimension)
    .group(monthGroup)
    .centerBar(true)
    .gap(1)
    .x(d3.time.scale().domain(d3.extent(data, d => d.created_at)))
    .round(d3.time.month.round)
    .alwaysUseRounding(true)
    .xUnits(d3.time.months)
    .yAxis()
    .tickFormat(v => '');

  // Day of week chart
  dayOfWeekChart
    .width(300)
    .height(300)
    .margins({
      top: 5, left: 10, right: 10, bottom: 20,
    })
    .dimension(dayOfWeek)
    .group(dayOfWeekGroup)
    .colors(d3.scale.category10())
    .label(d => d.key)
    .elasticX(true)
    .xAxis()
    .ticks(4);

  // source chart
  sourcePie.width(300)
    .height(300)
    .radius(100)
    .innerRadius(30)
    .dimension(sourceDimension)
    .title((d) => {
      let label = d.key;
      if (all.value()) {
        label += ` (${Math.floor(d.value / all.value() * 100)}%)`;
      }
      return `${label}\nNumber of tweets : ${d.value}`;
    })
    .group(sourceGroup);

  dc.renderAll();
  dc.redrawAll();
});
