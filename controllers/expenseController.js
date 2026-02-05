const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  const expense = await Expense.create({
    user: req.user._id,
    ...req.body
  });

  res.status(201).json(expense);
};

// Get All Expenses
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
  res.json(expenses);
};

// Get Single Expense by ID ✅ FIXED & EXPORTED
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

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Allow only these fields to be updated
    const allowedUpdates = [
      "title",
      "amount",
      "category",
      "description",
      "date"
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: "Invalid expense ID" });
  }
};


// Delete Expense
exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (expense.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await expense.deleteOne();
  res.json({ message: "Expense deleted" });
};


// Monthly Expense Summary
exports.getMonthlySummary = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ message: "Month and year are required" });
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

    if (byCategory[expense.category]) {
      byCategory[expense.category] += expense.amount;
    } else {
      byCategory[expense.category] = expense.amount;
    }
  });

  res.json({
    month: Number(month),
    year: Number(year),
    totalExpense,
    byCategory
  });
};
