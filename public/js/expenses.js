$(document).ready(() => {
  let wantsSum;
  let needsSum;
  let savingsSum;
  let leftoverBudget;

  $("#submit-expense-btn").on("click", addExpense);
  $(".delete-expense-btn").on("click", deleteExpense);

  displayChart();

  // post expense api call
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
      $.ajax("/api/expenses", {
        type: "POST",
        data: newExpense
      }).then(() => {
        location.reload();
      });
    }
  }

  // get expense data - api call
  function getExpenseData(cb) {
    $.ajax("/api/expenses", {
      type: "GET"
    }).then(data => {
      cb(data);
    });
  }

  // get income data - api call
  function getIncomeData(cb) {
    $.ajax("/api/income", {
      type: "GET"
    }).then(data => {
      cb(data);
    });
  }

  // delete an expense
  // *** use this route in app to delete an expense based on it's data-ID rendered with handlebars ***
  // eslint-disable-next-line no-unused-vars
  function deleteExpense() {
    const expenseId = $(this).data("expenseid");
    console.log("deleted");
    $.ajax(`/api/expenses/${expenseId}`, {
      type: "DELETE"
    }).then(data => {
      console.log(data);
      location.reload();
    });
  }

  // display chart based on expense and income data
  function displayChart() {
    getExpenseData(data => {
      findCategorySums(data);
      findLeftoverBudget(leftoverBudget => {
        renderPieChart([needsSum, wantsSum, savingsSum, leftoverBudget]);
      });
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
  }

  // find leftover budget based on income sum
  function findLeftoverBudget(cb) {
    getIncomeData(data => {
      const incomes = [];

      data.map(el => incomes.push(Number(el.amount)));

      totalIncome = findSum(incomes);
      leftoverBudget = totalIncome - (wantsSum + needsSum + savingsSum);
      cb(leftoverBudget);
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
  function renderPieChart(dataArr) {
    const actualChart = $("#actualChart");

    // eslint-disable-next-line no-unused-vars
    const expensesPieChart = new Chart(actualChart, {
      type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: ["Needs", "Wants", "Savings", "Leftover Budget"],
        datasets: [
          {
            label: "Categories",
            data: dataArr,
            backgroundColor: ["#07456f", "#009f9d", "#cdffeb", "#0f0a3c"],
            borderWidth: 1,
            borderColor: "white",
            hoverBorderWidth: 3
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
          labels: {
            fontColor: "black"
          }
        }
      }
    });
  }
});
