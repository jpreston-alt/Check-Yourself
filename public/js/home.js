$(document).ready(() => {
  let totalIncome;

  displayChart();
  getUserEmail();

  $("#submit-income").on("click", postIncome);
  $("#clear-income").on("click", deleteIncome);

  function getUserEmail() {
    $.ajax("/api/user_data", {
      type: "GET"
    }).then(data => {
      $("#name").text(data.email);
    });
  }

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
  }
  function calcBalance(totalIncome) {
    const needs = totalIncome * 0.5;
    const wants = totalIncome * 0.3;
    const savings = totalIncome * 0.2;
    $("#needs-val").text(`$${needs}`);
    $("#wants-val").text(`$${wants}`);
    $("#savings-val").text(`$${savings}`);
  }

  // get income data - api call
  function getIncomeData(cb) {
    $.ajax("/api/income", {
      type: "GET"
    }).then(data => {
      cb(data);
    });
  }

  // delete all income of logged in user
  function deleteIncome() {
    $.ajax("/api/income", {
      type: "DELETE"
    }).then(data => {
      console.log(data);
      location.reload();
    });
  }

  // render pie chart with income data
  function displayChart() {
    getIncomeData(data => {
      const incomes = [];

      // eslint-disable-next-line array-callback-return
      data.map(el => {
        incomes.push(Number(el.amount));
      });

      totalIncome = findSum(incomes);
      $("#total-income").text(totalIncome);
      calcIncPercentages(totalIncome);
      calcBalance(totalIncome);
      localStorage.setItem("userTotalIncome", totalIncome);
    });
  }

  // find sum - for finding some of categories
  function findSum(arr) {
    const sum = arr.reduce((a, b) => {
      return a + b;
    }, 0);

    return sum;
  }

  // calculate perecentages of total income
  function calcIncPercentages(total) {
    const needsPerc = total * 0.5;
    const wantsPerc = total * 0.3;
    const savingsPerc = total * 0.2;

    renderPieChart([needsPerc, wantsPerc, savingsPerc]);
  }

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
  }
});
