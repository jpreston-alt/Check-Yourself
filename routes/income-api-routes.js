const db = require("../models");

// ****************************** INCOME API ROUTES ********************************** //
module.exports = function(app) {
  // post income
  app.post("/api/income", (req, res) => {
    db.Income.create({
      amount: req.body.amount,
      UserId: req.user.id
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

  // delete user income (delete all income entered by the logged in user)
  app.delete("/api/income", (req, res) => {
    db.Income.destroy({
      where: {
        UserId: req.user.id
      }
    }).then(result => {
      if (result.affectedRows === 0) {
        return res.status(404).end();
      }
      res.status(200).end();
    });
  });

  // update income
};
