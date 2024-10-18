import mongoose from "mongoose"; // Importing the mongoose library for MongoDB

const { Schema, model, models } = mongoose; // Destructuring Schema, model, and models from mongoose

// Define the schema for the Chat collection
const noteSchema = new Schema(
  {
    title: {
      type: String, // Data type for the title field
      required: true, // Title is required
    },
    user: {
      type: Schema.Types.ObjectId, // Data type for ObjectId
      ref: "User", // Reference to the User model
    },
    content: [
      {
        type: String, // Data type for ObjectId
        required: false, // Content is not required
      },
    ],
    chat: [
      {
        type: Schema.Types.ObjectId, // Data type for ObjectId
        ref: "Chat", // Reference to the Chat model
      },
    ],
  },
  { timestamps: true } // Enable timestamps for created and updated times
);

// Define the Note model using the schema
// If the model exists in the models collection, use it; otherwise, create a new one
const Note = models.Note || model("Note", noteSchema);

export default Note; // Export the Chat model for use in other parts of the application
