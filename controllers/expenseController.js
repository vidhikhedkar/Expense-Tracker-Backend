const Expense = require("../models/Expense");

// =========================
// ADD EXPENSE
// =========================
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      description,
      date
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// GET ALL EXPENSES
// =========================
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// GET EXPENSE BY ID
// =========================
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: "Invalid expense ID" });
  }
};


// =========================
// UPDATE EXPENSE
// =========================
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const allowedFields = [
      "amount",
      "category",
      "description",
      "date"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        expense[field] = req.body[field];
      }
    });

    const updatedExpense = await expense.save();

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};


// =========================
// DELETE EXPENSE
// =========================
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};


// =========================
// MONTHLY SUMMARY
// =========================
exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    let totalExpense = 0;
    const byCategory = {};

    expenses.forEach((expense) => {
      totalExpense += expense.amount;

      byCategory[expense.category] =
        (byCategory[expense.category] || 0) + expense.amount;
    });

    res.json({
      month: Number(month),
      year: Number(year),
      totalExpense,
      byCategory
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};