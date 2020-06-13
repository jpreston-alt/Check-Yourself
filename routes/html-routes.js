// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // ****************************** HTML LOGIN/SIGNUP ROUTES ********************************** //
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/incomes");
      console.log(req.user);
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/incomes");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  // ****************************** HANDLEBARS EXPENSE ROUTE ********************************** //
  // switch route name "/expenses" for spending page route name
  app.get("/expenses", (req, res) => {
    db.Expense.findAll({
      where: {
        UserId: req.user.id
      }
    })
      .then(data => {
        const allExpenses = { expense: data };
        res.render("exp-index", allExpenses);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // ****************************** HANDLEBARS INCOME ROUTE ********************************** //
  // switch route name "/incomes" for home page route name
  app.get("/incomes", (req, res) => {
    db.Income.findAll({
      where: {
        UserId: req.user.id
      }
    })
      .then(data => {
        const allIncomes = { income: data };
        res.render("inc-index", allIncomes);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // ****************************** HTML CHART TEST ROUTES ********************************** //
  // html route for expense chart
  app.get("/expense-chart", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../public/chart-test/expense-chart.html")
    );
  });

  // html route for income chart
  app.get("/income-chart", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../public/chart-test/income-chart.html")
    );
  });
};
