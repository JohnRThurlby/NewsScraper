var mongoose = require('mongoose');
 
var articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        created: { 
            type: Date,
            default: Date.now
        } 
    });
 
var SavedArticle = mongoose.model('SavedArticle', articleSchema);
 
module.exports = SavedArticle;