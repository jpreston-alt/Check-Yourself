$(document).ready(() => {
  let wantsSum;
  let needsSum;
  let savingsSum;
  let monthlyIncome;
  let leftoverBudget;

  $("#submit-expense-btn").on("click", addExpense);
  $("#submit-income-btn").on("click", addIncome);

  init();

  // initialize the page by getting income and expense data, and render chart accordingly
  function init() {
    $.get("/api/expenses", data => {
      console.log(data);

      findCategorySums(data);
      findMonthlyIncome();
      renderPieChart(
        [needsSum, wantsSum, savingsSum],
        ["Needs", "Wants", "Savings", "Budget Left"]
      );
    });
  }

  // find the sum of wants, needs, and savings category
  function findCategorySums(arr) {
    const wants = [];
    const needs = [];
    const savings = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].category === "wants") {
        wants.push(Number(arr[i].cost));
      } else if (arr[i].category === "needs") {
        needs.push(Number(arr[i].cost));
      } else if (arr[i].category === "savings") {
        savings.push(Number(arr[i].cost));
      }
    }

    wantsSum = findSum(wants);
    needsSum = findSum(needs);
    savingsSum = findSum(savings);

    findLeftoverBudget();
  }

  // find leftover budget based on income sum
  function findLeftoverBudget() {
    $.get("/api/income", data => {
      const income = [];

      for (let i = 0; i < data.length; i++) {
        income.push(Number(data[i].amount));
      }

      monthlyIncome = findSum(income);
      leftoverBudget = monthlyIncome - (wantsSum + needsSum + savingsSum);
      console.log(leftoverBudget);
    });
  }

  function findMonthlyIncome() {
    $.get("/api/income", data => {
      const income = [];

      for (let i = 0; i < data.length; i++) {
        income.push(Number(data[i].amount));
      }

      monthlyIncome = findSum(income);
      console.log(monthlyIncome);
    });
  }

  // find sum of categories
  function findSum(arr) {
    const sum = arr.reduce((a, b) => {
      return a + b;
    }, 0);

    return sum;
  }

  // render pie chart
  function renderPieChart(dataArr, labelArr) {
    const actualChart = $("#actualChart");

    // eslint-disable-next-line no-unused-vars
    const expensesPieChart = new Chart(actualChart, {
      type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: labelArr,
        datasets: [
          {
            label: "Categories",
            data: dataArr,
            // backgroundColor: "green",
            backgroundColor: ["#07456f", "#009f9d", "#cdffeb", "#0f0a3c"],
            borderWidth: 1,
            borderColor: "white",
            hoverBorderWidth: 3
            // hoverBorderColor: "black"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Monthly Expenses",
          fontSize: 25
        },
        legend: {
          display: true,
          // position: "right",
          labels: {
            fontColor: "black"
          }
        },
        layout: {}
      }
    });
  }



  // add expense
  function addExpense(event) {
    event.preventDefault();

    const newExpense = {
      item: $("#expense-item")
        .val()
        .trim(),
      cost: Number($("#expense-cost").val()),
      category: $("#choose-category-dropdown option:selected")
        .val()
        .trim()
    };

    if (
      newExpense.item.trim() !== "" &&
      newExpense.cost > 0 &&
      newExpense.category !== "Category..."
    ) {
      console.log(newExpense);
      $.ajax("/api/expenses", {
        type: "POST",
        data: newExpense
      }).then(data => {
        console.log(data);
        location.reload();
      });
    }
  }

  function addIncome(event) {
    event.preventDefault();

    const newIncome = {
      amount: Number($("#income-amount").val())
    };

    if (newIncome.amount > 0) {
      console.log(newIncome);
      $.ajax("/api/income", {
        type: "POST",
        data: newIncome
      }).then(data => {
        console.log(data);
        location.reload();
      });
    }
  }
});
