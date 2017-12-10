cloud = require('./index.js');

(function () {
  const w = 960,
    h = 600,
    csvPath = 'data/wordoccurence.csv',
    nbMax = 250;

  let fill = d3v4.scaleOrdinal(d3v4.schemeCategory20),
    dataWord = [],
    nbOccurrenceMax;

  console.log('Ready to build cloud');

  function loadData(cb) {
    console.log('Loading data via csv file');
    d3v4.csv(csvPath, (data) => {
      data.forEach((d) => {
        if (dataWord.length < nbMax) {
          dataWord.push({ text: d.text, size: d.occurrence });
        }
      });

      nbOccurrenceMax = dataWord[0].size;
      console.log(nbOccurrenceMax);
      console.log(`We have ${dataWord.length} words to put in cloud`);

      const layout = cloud()
        .timeInterval(10)
        .size([w, h])
        .words(dataWord.map(d => ({ text: d.text, size: 10 + ((d.size / nbOccurrenceMax) * 1.5) * 90 })))
        .padding(2)
        .rotate(() => (~~(Math.random() * 6) - 3) * 30)
        .font('Impact')
        .fontSize(d => d.size)
        .on('end', draw);

      console.log('Starting cloud layout');
      layout.start();

      function draw(words) {
        d3v4.select('body').selectAll('.chart')
          .attr('width', w)
          .attr('height', h)
          .append('g')
          .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', 'Impact')
          .style('fill', (d, i) => fill(i))
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text(d => d.text);
      }
    });
  }


  function doSequenceOfTasks(tasksAreDone) {
    d3v4.queue()
      .defer(loadData)
      .await(tasksAreDone);
  }

  doSequenceOfTasks((err, data) => {
    if (err) {
      console.log('Could not load data');
      console.log(err);
    } else {
      console.log('Cloud is created with');
    }
  });
}());
