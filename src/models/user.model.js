import mongoose from "mongoose";

const COLLECTION_NAME = "users";
const DOCUMENT_NAME = "user";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const UserModel = mongoose.model(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
export default UserModel;