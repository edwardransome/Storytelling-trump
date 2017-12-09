cloud = require("../index.js");

(function () {
  var fill = d3v4.scaleOrdinal(d3v4.schemeCategory20);

  console.log("Ready to have fun with D3.js");
  var dataWord = [];
  var nbmax = 150;

  /**
   * First we need to get some data
   */
  function loadData(cb) {
    console.log("Loading data via csv file");
    d3v4.csv("data/wordoccurence.csv", function (data) {

      data.forEach(function (d) {
        if (dataWord.length < nbmax) {
          dataWord.push({text: d.text, size: d.occurrence});
        }
      });

      console.log("Data. We have " + dataWord.length + " words to put in cloud");

      var layout = cloud()
        .size([1000, 500])
        .words(dataWord.map(function (d) {
          return {text: d.text, size: 10 + Math.random() * 90, test: "haha"};
        }))
        .padding(2)
        .rotate(function () {
          return (~~(Math.random() * 6) - 3) * 30;
        })
        .font("Impact")
        .fontSize(function (d) {
          return d.size;
        })
        .on("end", draw);

      console.log("layout is starting");
      layout.start();


      function draw(words) {
        d3v4.select("body").selectAll(".chart")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function (d) {
            return d.size + "px";
          })
          .style("font-family", "Impact")
          .style("fill", function (d, i) {
            return fill(i);
          })
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) {
            return d.text;
          });
      }

    });
  }

  function createCloud(cb) {

    cb(null, "do nothing");
  }

  function doSequenceOfTasks(tasksAreDone) {
    d3v4.queue()
      .defer(loadData)
      .defer(createCloud)
      .await(tasksAreDone);
  }

  doSequenceOfTasks(function (err, data, load) {
    if (err) {
      console.log("Could not load data");
      console.log(err);
    } else {
      console.log(load);
    }
  });

})();
