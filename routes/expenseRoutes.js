const express = require("express");
const router = express.Router();
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById,
  getMonthlySummary
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

// Summary route FIRST ✅
router.get("/summary", getMonthlySummary);

// GET all expenses
router.get("/", getExpenses);

// GET single expense by ID  ✅ ADD THIS
router.get("/:id", getExpenseById);




// ADD expense
router.post("/", addExpense);

// UPDATE expense
router.patch("/:id", updateExpense);

// DELETE expense
router.delete("/:id", deleteExpense);

module.exports = router;
