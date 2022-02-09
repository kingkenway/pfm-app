const Data = {
  ChartData(credits, debits) {
    console.log({ credits, debits });
    return {
      type: "line",
      data: {
        labels: ["November", "October", "September", "August", "July"],
        datasets: [
          {
            label: "Debits",
            // data: [0, 0, 1, 2, 79, 82, 27, 14],
            data: debits,
            backgroundColor: "rgba(54,73,93,.5)",
            borderColor: "#36495d",
            borderWidth: 3,
          },
          {
            label: "Credits",
            // data: [0.166, 2.081, 3.003, 0.323, 954.792, 285.886, 43.662, 51.514],
            data: credits,
            backgroundColor: "rgba(71, 183,132,.5)",
            borderColor: "#47b784",
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                padding: 25,
              },
            },
          ],
        },
      },
    };
  },
};

export default Data;
