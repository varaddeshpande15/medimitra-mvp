import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Define categories for expenses
const categories = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Utilities",
  "Health",
  "Education",
  "Miscellaneous",
];

// Expense schema
const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: categories, // Restrict to predefined categories
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Expense = models.Expense || model("Expense", expenseSchema);
export default Expense;
