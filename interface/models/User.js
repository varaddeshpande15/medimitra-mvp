import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Define the User Schema
const userSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: false,
		},
		chats: [
			{
				type: Schema.Types.ObjectId, // References to the Chat model
				ref: "Chat", // Reference the Chat collection
				required: false, // This field can be optional
			},
		],
		notes: [
			{
				type: Schema.Types.ObjectId, // References to the Note model
				ref: "Note", // Reference the Note collection
				required: false, // This field can be optional
			},
		],
		watchlist: [
			{
				type: String, // Assume watchlist contains topic names as strings
				required: false,
			},
		],
	},
	{ timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;