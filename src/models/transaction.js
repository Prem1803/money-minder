const mongoose = require("mongoose");

const transactionShema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    paidTo: {
      type: String,
    },
    paidFor: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Credit", "Debit"],
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionShema);
module.exports = Transaction;
