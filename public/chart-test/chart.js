/* eslint-disable prettier/prettier */
/* eslint-disable no-extra-semi */
/* eslint-disable prefer-const */
$(document).ready(() => {

  let wantsSum;
  let needsSum;
  let savingsSum;
  let monthlyIncome;
  let leftoverBudget;

  init();

  // initialize the page by getting income and expense data, and render chart accordingly
  function init() {
    $.get("/api/expenses", data => {
      console.log(data);

      findCategorySums(data);
      renderPieChart([needsSum, wantsSum, savingsSum]);
    });
  };

  // find the sum of wants, needs, and savings category
  function findCategorySums(arr) {
    let wants = [];
    let needs = [];
    let savings = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].category === "wants") {
        wants.push(Number(arr[i].cost));
      } else if (arr[i].category === "needs") {
        needs.push(Number(arr[i].cost));
      } else if (arr[i].category === "savings") {
        savings.push(Number(arr[i].cost));
      };
    };

    wantsSum = findSum(wants);
    needsSum = findSum(needs);
    savingsSum = findSum(savings);

    findLeftoverBudget();
  };

  // find leftover budget based on income sum
  function findLeftoverBudget() {
    $.get("/api/income", data => {
      let income = [];

      for (let i = 0; i < data.length; i++) {
        income.push(Number(data[i].amount));
      };

      monthlyIncome = findSum(income);
      leftoverBudget = monthlyIncome - (wantsSum + needsSum + savingsSum);
      console.log(leftoverBudget);
    });
  };

  // find sum of categories
  function findSum(arr) {
    let sum = arr.reduce((a, b) => {
      return a + b;
    }, 0);

    return sum;
  };

  // render pie chart
  function renderPieChart(dataArr) {
    let myChart = $("#myChart");

    // eslint-disable-next-line no-unused-vars
    let expensesPieChart = new Chart(myChart, {
      type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: ["Needs", "Wants", "Savings", "Budget Left"],
        datasets: [{
          label: "Categories",
          data: dataArr,
          // backgroundColor: "green",
          backgroundColor: ["#07456f", "#009f9d", "#cdffeb", "#0f0a3c"],
          borderWidth: 1,
          borderColor: "white",
          hoverBorderWidth: 3,
          // hoverBorderColor: "black"
        }],
      },
      options: {
        title: {
          display: true,
          text: "Monthly Expenses",
          fontSize: 25,
        },
        legend: {
          display: true,
          // position: "right",
          labels: {
            fontColor: "black",
          }
        },
        layout: {

        },
      }
    });
  };

});
