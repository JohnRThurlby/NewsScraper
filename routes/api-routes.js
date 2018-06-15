// Node Dependencies

const cheerio = require('cheerio'),
      mongoose = require('mongoose'),
      request = require('request')

// Import the Comment and Article models
var Notes = require('../models/Notes.js');
var Article = require('../models/Articles.js');

// If deployed, use the deployed database. Otherwise use the local mongoose_news database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoose_news";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

module.exports = function(app) {

// Index Page Render (first visit to the site)
app.get('/', function (req, res){

  // Scrape data
  res.redirect('/scrape');

});


// Articles Page Render
app.get('/articles', function (req, res){

  // Query MongoDB for all article entries (sort newest to top, assuming Ids increment)
  Article.find().sort({_id: -1})

    // But also populate all of the comments associated with the articles.
    .populate('notes')

    // Then, send them to the handlebars template to be rendered
    .exec(function(err, doc){
      // log any errors
      if (err){
        console.log(err);
      } 
      // or send the doc to the browser as a json object
      else {
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);
        // res.json(hbsObject)
      }
    });

});


// Web Scrape Route
app.get('/scrape', function(req, res) {

  // First, grab the body of the html with request
  request('http://www.nytimes.com/section/us', function(error, response, html) {

    // Then, load html into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // This is an error handler for the Onion website only, they have duplicate articles for some reason...
    var headlineArray = [];

    // Now, grab every everything with a class of "inner" with each "article" tag

    $('a[class=story-link]').each(function(i, element) {

        // Create an empty result object
        var result = {}
       
        result.headline = $(element).find('h2.headline').text().trim(),
        result.summary  = $(element).find('p.summary').text().trim(),
        result.storyUrl = $(element).find('.story-body>.story-link').attr('href'),
        result.imgUrl   = $(element).find('img').attr('src'),
        result.byLine   = $(element).find('p.byline').text().trim()

        console.log("headline " + result.headline)
        
        console.log("summary " + result.summary)
        console.log("storyUrl " + result.storyUrl)
        console.log("imgUrl " + result.imgUrl)
        console.log("byLine " + result.byLine)

        // Error handling to ensure there are no empty scrapes
        if(result.headline !== "" &&  result.storyUrl !== "" && typeof result.storyUrl !== undefined ) {

          // Due to async, moongoose will not save the articles fast enough for the duplicates within a scrape to be caught
          if(headlineArray.indexOf(result.headline) == -1){

            // Push the saved item to our titlesArray to prevent duplicates thanks the the pesky Onion...
            headlineArray.push(result.headline);

            // Only add the entry to the database if is not already there
            Article.count({ headline: result.headline}, function (err, test){

              // If the count is 0, then the entry is unique and should be saved
              if(test == 0){

                // Using the Article model, create a new entry (note that the "result" object has the exact same key-value pairs of the model)
                var entry = new Article (result);

                // Save the entry to MongoDB
                entry.save(function(err, doc) {
                  // log any errors
                  if (err) {
                    console.log(err);
                  } 
                  // or log the doc that was saved to the DB
                  else {
                    console.log(doc);
                  }
                });

              }
              // Log that scrape is working, just the content was already in the Database
              else{
                console.log('Redundant Database Content. Not saved to DB.')
              }

            });
        }
        // Log that scrape is working, just the content was missing parts
        else{
          console.log('Redundant Content. Not Saved to DB.')
        }

      }
      // Log that scrape is working, just the content was missing parts
      else{
        console.log('Empty Content. Not Saved to DB.')
      }

    });

    // Redirect to the Articles Page, done at the end of the request for proper scoping
    res.redirect("/articles");

  });

});


// Add a Comment Route - **API**
app.post('/add/notes/:id', function (req, res){

  // Collect article id
  var articleId = req.params.id;
  
  // Collect Author Name
  var notesAuthor = req.body.name;

  // Collect Comment Content
  var notesContent = req.body.notes;

  // "result" object has the exact same key-value pairs of the "Comment" model
  var result = {
    author: notesAuthor,
    content: notesContent
  };

  // Using the Comment model, create a new comment entry
  var entry = new Notes (result);

  // Save the entry to the database
  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    } 
    // Or, relate the comment to the article
    else {
      // Push the new Comment to the list of comments in the article
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'notes':doc._id}}, {new: true})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // Send Success Header
          res.sendStatus(200);
        }
      });
    }
  });

});




// Delete a Note Route
app.post('/remove/notes/:id', function (req, res){

  // Collect comment id
  var notesId = req.params.id;

  // Find and Delete the Comment using the Id
  Notes.findByIdAndRemove(notesId, function (err, todo) {  
    
    if (err) {
      console.log(err);
    } 
    else {
      // Send Success Header
      res.sendStatus(200);
    }

  });

});

}
