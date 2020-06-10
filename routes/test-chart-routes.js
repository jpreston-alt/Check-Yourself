const path = require("path");
const db = require("../models");

module.exports = function(app) {
  // html route for chart
  app.get("/chart", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/chart-test/chart.html"));
  });

  // get current month expenses, based on userID
  app.get("/api/expenses", (req, res) => {
    db.Expense.findAll({
      where: {
        UserId: req.user.id
      }
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // get current month income, based on userID
  app.get("/api/income", (req, res) => {
    db.Income.findAll({
      where: {
        UserId: req.user.id
      }
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });
};
