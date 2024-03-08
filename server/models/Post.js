const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,//file image path.
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
    // If you set timestamps: true, Mongoose will add two properties of type Date to your schema:

    // createdAt: a date representing when this document was created
    // updatedAt: a date representing when this document was last updated    
});

const PostModel = model('Post', PostSchema);
//posts collection.

module.exports = PostModel;