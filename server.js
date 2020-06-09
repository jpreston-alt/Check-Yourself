// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/test-chart-routes.js")(app);

// Syncing our database and logging a message to the user upon success
// forced true turned on in dev mode -- will delete when we deploy
db.sequelize.sync({ force: true }).then(() => {
  // pre-populate some test table data -- delete when deploy
  db.User.create({
    email: "joannappreston@gmail.com",
    password: "igloos"
  }).then(() => {
    db.Expense.create({
      item: "Electric Bill",
      cost: 59.78,
      category: "needs",
      UserId: 1
    });

    db.Expense.create({
      item: "Movie Tickets",
      cost: 12.50,
      category: "wants",
      UserId: 1
    });

    db.Expense.create({
      item: "Vet Bill",
      cost: 199.6785,
      category: "needs",
      createdAt: "2020-05-05 16:02:12",
      UserId: 1
    });

    db.Expense.create({
      item: "Student Loan Payment",
      cost: 300,
      category: "savings",
      createdAt: "2020-04-05 16:02:12",
      UserId: 1
    });

    db.Income.create({
      amount: 3000,
      createdAt: "2020-06-05 16:02:12",
      UserId: 1
    });

    db.Income.create({
      amount: 1500,
      createdAt: "2020-05-05 16:02:12",
      UserId: 1
    });

    db.Income.create({
      amount: 2200,
      createdAt: "2020-04-05 16:02:12",
      UserId: 1
    });
  });

  db.User.create({
    email: "w@w.com",
    password: "igloos"
  }).then(() => {
    db.Expense.create({
      item: "Rent",
      cost: 1100,
      category: "needs",
      UserId: 2
    });

    db.Income.create({
      amount: 2000,
      UserId: 2
    });

    db.Expense.create({
      item: "Shopping",
      cost: 100,
      category: "wants",
      UserId: 1
    });

    db.Expense.create({
      item: "Rent",
      cost: 300,
      category: "needs",
      UserId: 1
    });
  });

  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
