$(document).ready(() => {
  //get suggested spending from budget page
  const userTotalIncome = localStorage.getItem("userTotalIncome");
  const needsPerc = userTotalIncome * 0.5;
  const wantsPerc = userTotalIncome * 0.3;
  const savingsPerc = userTotalIncome * 0.2;

  //get actual spending from spending page
  const wantsSum = localStorage.getItem("userTotalWants");
  const needsSum = localStorage.getItem("userTotalNeeds");
  const savingsSum = localStorage.getItem("userTotalSavings");

  renderBarChart([
    needsPerc,
    needsSum,
    wantsPerc,
    wantsSum,
    savingsPerc,
    savingsSum
  ]);

  // render bar chart
  function renderBarChart(dataArr) {
    const incomeChart = $("#myBarChart");

    // eslint-disable-next-line no-unused-vars
    const expensesBarChart = new Chart(incomeChart, {
      type: "bar", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: [
          "Needs Plan",
          "Needs Actuals",
          "Wants Plan",
          "Wants Actuals",
          "Savings Plan",
          "Savings Actuals"
        ],
        datasets: [
          {
            data: dataArr,
            backgroundColor: [
              "#07456F",
              "#037BFE",
              "#009F9D",
              "#DD3444",
              "#CDFFEB",
              "#28A745"
            ],
            borderWidth: 1,
            borderColor: "white",
            hoverBorderWidth: 3
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Monthly Spending Dashboard",
          fontSize: 25
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        legend: {
          display: false,
          labels: {
            fontColor: "black"
          }
        }
      }
    });
  }
});
