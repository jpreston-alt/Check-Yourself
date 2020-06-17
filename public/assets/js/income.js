$(document).ready(() => {
  let totalIncome;

  displayChart();
  $("#submit-income-btn").on("click", postIncome);
  function postIncome(event) {
    event.preventDefault();
    console.log("hello");

    const income = Number($("#income-amount").val());

    //set the 'amount' row from databse to income's value
    const newIncome = {
      amount: income
    };
    $("#needs-val").val(parseInt(income * 0.5));
    console.log(income * 0.5);

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
  function getIncomeData(cb) {
    $.ajax("/api/income", {
      type: "GET"
    }).then(data => {
      cb(data);
    });
  }
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
