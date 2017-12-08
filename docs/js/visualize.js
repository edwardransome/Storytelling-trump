(function () {
  console.log("Ready to have fun with D3.js");

  function doThis(cb){ cb(null,"result of this") }
  function doThat(cb){ cb(null,"result of that") }

  /**
   * First we need to get some data
   */
  function loadData(cb){
    console.log("Loading data via csv file")
    d3.csv("../data/obama.csv", function(data) {
      dataset = data.map(function(d) { return [ +d["x-coordinate"], +d["y-coordinate"] ]; });
    });
  }

  function doSequenceOfTasks(tasksAreDone){
    d3.queue()
      .defer(doThis)
      .defer(loadData)
      .defer(doThat)
      .await(tasksAreDone);
  }

  doSequenceOfTasks(function(err, r1, data, r2){
    if(err){
      console.log("Could not load data");
      console.log(err);
    }else{
      console.log(r1);
      console.log(r2);
      console.log("Data is available. We have "+ data.length + "tweets to play with");
    }
  });

})();