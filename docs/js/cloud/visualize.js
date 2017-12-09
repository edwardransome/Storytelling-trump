cloud = require("../index.js");

(function () {
  var fill = d3v4.scaleOrdinal(d3v4.schemeCategory20),
    w = 960,
    h = 600,
    dataWord = [],
    nbMax = 150,
    csvPath = "data/wordoccurence.csv";

  console.log("Ready to build cloud");


  function loadData(cb) {
    console.log("Loading data via csv file");
    d3v4.csv(csvPath, function (data) {

      data.forEach(function (d) {
        if (dataWord.length < nbMax) {
          dataWord.push({text: d.text, size: d.occurrence});
        }
      });

      console.log("We have " + dataWord.length + " words to put in cloud");

      var layout = cloud()
        .size([w, h])
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

      console.log("Starting cloud layout");
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


  function doSequenceOfTasks(tasksAreDone) {
    d3v4.queue()
      .defer(loadData)
      .await(tasksAreDone);
  }

  doSequenceOfTasks(function (err, data) {
    if (err) {
      console.log("Could not load data");
      console.log(err);
    } else {
      console.log("Cloud is created with");
    }
  });

})();
