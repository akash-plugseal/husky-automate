import mongoose from "mongoose";

const COLLECTION_NAME = "contents";
const DOCUMENT_NAME = "content";

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,

});

const ContentModel = mongoose.model(DOCUMENT_NAME, contentSchema, COLLECTION_NAME);
export default ContentModel;