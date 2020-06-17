$(document).ready(() => {
  let wantsSum;
  let needsSum;
  let savingsSum;
  let leftoverBudget;
  let totalIncome;

  $("#submit-expense-btn").on("click", addExpense);
  $(".delete-expense-btn").on("click", deleteExpense);

  renderPage();

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
  function renderPage() {
    getExpenseData(data => {
      findCategorySums(data);
      findLeftoverBudget(leftoverBudget => {
        let dataArr;
        console.log(leftoverBudget);

        if (leftoverBudget < 0) {
          dataArr = [needsSum, wantsSum, savingsSum];
        } else {
          dataArr = [needsSum, wantsSum, savingsSum, leftoverBudget];
        }

        renderPieChart(dataArr);
        $("#needs-balance").text(`$${needsSum}`);
        $("#wants-balance").text(`$${wantsSum}`);
        $("#savings-balance").text(`$${savingsSum}`);
        $("#leftover-budget").text(`$${leftoverBudget}`);
        calcGoals(totalIncome);

        // localStorage.setItem("userTotalExpenses", needsSum, wantsSum, savingsSum);
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

    localStorage.setItem("userTotalNeeds", needsSum);
    localStorage.setItem("userTotalWants", wantsSum);
    localStorage.setItem("userTotalSavings", savingsSum);
  }

  // find leftover budget based on income sum
  function findLeftoverBudget(cb) {
    getIncomeData(data => {
      const incomes = [];

      data.map(el => incomes.push(Number(el.amount)));

      totalIncome = findSum(incomes);
      $("#total-budget").text(`$${totalIncome}`);
      leftoverBudget = totalIncome - (wantsSum + needsSum + savingsSum);
      cb(leftoverBudget);
    });
  }

  function calcGoals(totalInc) {
    const wantsGoal = totalInc * 0.3;
    const needsGoal = totalInc * 0.5;
    const savingsGoal = totalInc * 0.2;
    $("#goal-wants").text(`$${wantsGoal}`);
    $("#goal-needs").text(`$${needsGoal}`);
    $("#goal-savings").text(`$${savingsGoal}`);
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
            backgroundColor: ["#6a2c70", "#f08a5d", "#b83b5e", "#ffc933"],
            borderWidth: 1,
            borderColor: "white",
            hoverBorderWidth: 3
          }
        ]
      },
      options: {
        // title: {
        //   display: true,
        //   text: "Monthly Expenses",
        //   fontSize: 25
        // },
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
