var trumpDataTable = dc.dataTable("#data-table");

d3.json('data/trumptwitterarchive.json', function (data) {
    var dateFormat = d3.time.format('%a %b %d %H:%M:%S %Z %Y');
    var numberFormat = d3.format('.2f');
    data.forEach(function (d) {
        d.created_at = dateFormat.parse(d.created_at);
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

    dc.renderAll();
    dc.redrawAll();


});