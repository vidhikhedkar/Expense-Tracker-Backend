const app = require("./app");

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expenses Tracker API is running successfully 🚀",
  });
});


app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
