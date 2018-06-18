// Include the momentJS library
var moment = require("moment");

// Require Mongoose
var mongoose = require('mongoose')

// Create a Schema Class
var Schema = mongoose.Schema

// Create Article Schema
var ArticleSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  summary: String,
  storyUrl: String,
  imgUrl: String,
  byLine: String,
  saved: {
    type: Boolean,
    default: false
  },
  // Date of article scrape (saving as a string to prettify it in Moment-JS)
  updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
  },

  // Create a relation with the Comment model
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Notes'
  }]

})

ArticleSchema.index({headline: "text"});

// Create the Article model with Mongoose
var Article = mongoose.model('Article', ArticleSchema);

// Export the Model
module.exports = Article;