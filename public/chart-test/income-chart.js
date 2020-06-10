/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-extra-semi */

$(document).ready(() => {

  let totalIncome;

  displayChart();
  
  $("#submit-income-btn").on("click", postIncome);

  // post income api call
  function postIncome(event) {
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
  };

  // get income data - api call
  function getIncomeData(cb) {
    $.ajax("/api/income", {
      type: "GET",
    }).then(data => {
      cb(data);
    });
  };

  // render pie chart with income data
  function displayChart() {
    getIncomeData(data => {
      let incomes = [];

      data.map(el => {
        incomes.push(Number(el.amount));
      });

      totalIncome = findSum(incomes);
      $("#total-income").text(totalIncome);
      calcIncPercentages(totalIncome);
    });
  };

  // find sum of categories
  function findSum(arr) {
    const sum = arr.reduce((a, b) => {
      return a + b;
    }, 0);

    return sum;
  };

  // calculate perecentages of total income
  function calcIncPercentages(total) {
    let needsPerc = total * .5;
    let wantsPerc = total * .3;
    let savingsPerc = total *.2;

    renderPieChart([needsPerc, wantsPerc, savingsPerc]);
  };

  // render pie chart
  function renderPieChart(dataArr) {
    const incomeChart = $("#goalChart");

    // eslint-disable-next-line no-unused-vars
    const expensesPieChart = new Chart(incomeChart, {
      type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: ["Needs", "Wants", "Savings"],
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
          text: "Suggested Monthly Spending",
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
  };

});
