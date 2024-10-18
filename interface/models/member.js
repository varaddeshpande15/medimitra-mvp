import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const memberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    Breakfast: {
        type: String,
        required: true
    },
    Lunch: {
        type: String,
        required: true
    },
    Dinner: {
        type: String,
        required: true
    }
});

// Check if the model exists in `models`, else create a new model
const Member = models.Member || model("Member", memberSchema);

export default Member;
