// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db

// Dependencies
// =============================================================

// Requiring our models
require("dotenv").config()
const cheerio = require('cheerio'),
      mongoose = require('mongoose'),
      request = require('request'),
      NewsAPI = require('newsapi')
      newsapi = new NewsAPI('e3daf6bfc25a4170b68dc74faec1774c')
      
var objectEv = {
  article:
  [
    ]
};

var SavedArticle = require('../models/savedArticles.js');

mongoose.connect('mongodb://localhost/mongoose_news', function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');
 
});

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for landing page 
  app.get("/", function(req, res) {
    res.render("index")
  })

  app.get("/api/logout", function(req, res) {
    res.render("index")
  })

  app.get("/api/newArticles", function(req, res) {
    newsapi.v2.topHeadlines({
      language: 'en'
    }).then(response => {
      // console.log(response);
      objectEv = response
      console.log(objectEv)
      res.render("index", objectEv )
    });
  })

  app.post("/api/saveArticle", function(req, res) {
    console.log(req.body)
    var savedArticle = new SavedArticle({
      _id: new mongoose.Types.ObjectId(),
      title: 'Trying mongoose',
      description: 'Trying mongoose',   
      url: 'https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527'
    });
    console.log(savedArticle)
    savedArticle.save(function(err) {
      if (err) throw err;
      
      console.log('Article successfully saved.');
      
    });
    res.render("index", objectEv)
  })

  app.get("/api/savedArticles", function(req, res) {
    SavedArticle.find({}).sort('-created')
    .exec(function(err, response) {
        if (err) throw err;
        console.log(response);
        objectEv = response
    });
    res.render("index", objectEv )
  })
}
