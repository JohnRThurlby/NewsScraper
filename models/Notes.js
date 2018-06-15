// Require Mongoose
var mongoose = require('mongoose')

// Create a Schema Class
var Schema = mongoose.Schema

// Create Comment Schema
var NotesSchema = new Schema({

  // Author's Name
  author: {
    type: String
  },
  // Comment Content
  content: {
    type: String
  }
  
});


// Create the Notes model with Mongoose
var Notes = mongoose.model('Notes', NotesSchema)

// Export the Model
module.exports = Notes