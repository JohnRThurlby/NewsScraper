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


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for landing page 
  app.get("/", function(req, res) {
    newsapi.v2.topHeadlines({
      language: 'en'
    }).then(response => {
      // console.log(response);
      objectEv = response
      console.log(objectEv)
      res.render("index", objectEv )
    });
  })

  app.get("/api/logout", function(req, res) {
    res.render("index")
  })
  
  
}
