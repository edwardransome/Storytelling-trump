# Trump: A short story
This is the repository for our storytelling project, which can be found [here](https://edwardransome.github.io/Storytelling-trump/). This project was created for the TWEB 2017 class at the School of Business and Engineering Vaud.
We decided to take a look at Donald Trump's Twitter and, using an archive of all his tweets, explore his social media presence.


## Data and data treatment
All the source data used in this project was taken from the [Trump Twitter Archive](http://www.trumptwitterarchive.com/archive). We originally used a CSV format to download and store data, however a few tweets contained a '\r' character which adds a newline to the textbox containing the tweets and messes up the rest of the data. We therefore had to transition to the JSON format.

### Word cloud
For the word cloud, we used a Java 8 program to stream every single tweet body and map each word to a number of occurences. We ignored pronouns and some articles since they would always be the most used words. Words with less than 3 occurences were removed from the map. The results are stored in `data/wordoccurence.csv`.
The first 250 words are used to generate the word cloud, with words increasing in size based on their number of occurences.

### Interactive charts
The interactive charts use the JSON data as is, with no modification. Using [crossfilter](http://square.github.io/crossfilter/), we can use dimensions to filter the data however we like. The charts are generated using [dc.js](https://dc-js.github.io/dc.js/) and are inspired by the tutorial found [here](http://dc-js.github.io/dc.js/docs/stock.html#section-10) and [here](http://bl.ocks.org/d3noob/6584483).

## Modification note
After modifying any of the Javascript files, you must run the `browserify` command to regenerate the `bundle.js` file, which is a bundle containing all of our scripts. To generate this bundle, use the command `browserify js/main.js -o js/bundle.js` from the root folder (in our case, the `docs` folder).

## Authors

 - [Edward Ransome](https://github.com/edwardransome)
 - [Michael Spierer](https://github.com/oceanos1)
