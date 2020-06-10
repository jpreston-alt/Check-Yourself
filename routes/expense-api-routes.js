const db = require("../models");

// ****************************** EXPENSE API ROUTES ********************************** //
module.exports = function(app) {
  // post expense from a user
  app.post("/api/expenses", (req, res) => {
    db.Expense.create({
      item: req.body.item,
      cost: req.body.cost,
      category: req.body.category,
      UserId: req.user.id
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // get all expenses from a single user
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

  // delete expense based on items unique identifier
  app.delete("/api/expenses/:id", (req, res) => {
    db.Expense.destroy({
      where: {
        id: req.params.id
      }
    }).then(result => {
      if (result.affectedRows === 0) {
        return res.status(404).end();
      }
      res.status(200).end();
    });
  });

  // update expense
};
