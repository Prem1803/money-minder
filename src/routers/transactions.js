const express = require("express");
const { auth } = require("../middleware");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const TransactionRouter = new express.Router();

TransactionRouter.post("/transaction/add", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let {
      amount,
      date,
      paymentMethod,
      paidTo,
      paidFor,
      paymentType = "Debit",
      remarks,
    } = req.body;
    if (!amount || !date)
      throw new Error(`${amount ? "Date" : "Amount"} is required`);
    const transaction = new Transaction({
      amount,
      date,
      paymentMethod,
      paidTo,
      paidFor,
      paymentType,
      remarks,
      userId,
    });
    await transaction.save();
    res.status(200).send({ message: "Transaction saved", transaction });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

TransactionRouter.get("/transactions", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let transactions = await Transaction.aggregate([
      { $match: { userId } },
      { $sort: { date: -1, amount: -1 } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          transactions: { $push: "$$ROOT" },
        },
      },
      { $project: { _id: 0, date: "$_id", transactions: 1 } },
    ]);
    res.status(200).send({ transactions });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

TransactionRouter.post("/transaction/update", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let {
      transactionId,
      amount,
      date,
      paymentMethod,
      paidTo,
      paidFor,
      paymentType = "Debit",
      remarks,
    } = req.body;
    if (!transactionId) throw new Error("Transaction id is required");
    if (!amount || !date)
      throw new Error(`${amount ? "Date" : "Amount"} is required`);
    let transaction = await Transaction.findOne({
      userId,
      _id: transactionId,
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (amount) transaction.amount = amount;
    if (date) transaction.date = date;
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (paidTo) transaction.paidTo = paidTo;
    if (paidFor) transaction.paidFor = paidFor;
    if (paymentType) transaction.paymentType = paymentType;
    if (remarks) transaction.remarks = remarks;
    await transaction.save();
    res.status(200).send({ message: "Transaction saved", transaction });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
TransactionRouter.post("/transaction/delete", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let { transactionId } = req.body;
    if (!transactionId) throw new Error("Transaction id is required");
    let transaction = await Transaction.findOneAndDelete({
      userId,
      _id: transactionId,
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    res.status(200).send({ message: "Transaction deleted", transaction });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = TransactionRouter;
