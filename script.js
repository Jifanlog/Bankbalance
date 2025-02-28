// This file contains the JavaScript code that handles user input, processes the bank balance data, and generates the graph.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("balance-form");
  const balanceInput = document.getElementById("balance");
  const monthInput = document.getElementById("month");
  const clearButton = document.getElementById("clear-button");
  const removeLastButton = document.getElementById("remove-last-button");
  const switchChartButton = document.getElementById("switch-chart-button");
  const exportCsvButton = document.getElementById("export-csv-button");
  const importCsvButton = document.getElementById("import-csv-button");
  const importCsvFile = document.getElementById("import-csv-file");
  const toggleDarkModeButton = document.getElementById("toggle-dark-mode");
  const ctx = document.getElementById("balanceChart").getContext("2d");
  let balances = JSON.parse(localStorage.getItem("balances")) || [];
  let months = JSON.parse(localStorage.getItem("months")) || [];
  let chartType = "line"; // Default chart type

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const month = monthInput.value;
    const balance = parseFloat(balanceInput.value);

    if (month && !isNaN(balance)) {
      if (months.includes(month)) {
        alert("This month is already entered. Please enter a different month.");
      } else {
        months.push(month);
        balances.push(balance);
        updateGraph();
        form.reset();
        saveData();
      }
    } else {
      alert("Please enter a valid month and balance.");
    }
  });

  clearButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all data?")) {
      months = [];
      balances = [];
      updateGraph();
      form.reset();
      saveData();
    }
  });

  removeLastButton.addEventListener("click", function () {
    if (
      months.length > 0 &&
      confirm("Are you sure you want to remove the last entry?")
    ) {
      months.pop();
      balances.pop();
      updateGraph();
      saveData();
    }
  });

  switchChartButton.addEventListener("click", function () {
    chartType = chartType === "line" ? "bar" : "line";
    updateGraph();
  });

  exportCsvButton.addEventListener("click", function () {
    let csvContent = "data:text/csv;charset=utf-8,Month,Balance\n";
    months.forEach((month, index) => {
      csvContent += `${month},${balances[index]}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bank_balance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  importCsvButton.addEventListener("click", function () {
    importCsvFile.click();
  });

  importCsvFile.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csv = e.target.result;
        const lines = csv.split("\n");
        months = [];
        balances = [];
        for (let i = 1; i < lines.length; i++) {
          const [month, balance] = lines[i].split(",");
          if (month && balance) {
            months.push(month);
            balances.push(parseFloat(balance));
          }
        }
        updateGraph();
        saveData();
      };
      reader.readAsText(file);
    }
  });

  toggleDarkModeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });

  function updateGraph() {
    if (window.barGraph) {
      window.barGraph.destroy();
    }
    window.barGraph = new Chart(ctx, {
      type: chartType, // Use the current chart type
      data: {
        labels: months,
        datasets: [
          {
            label: "Bank Balance",
            data: balances,
            backgroundColor:
              chartType === "bar"
                ? "rgba(75, 192, 192, 0.2)"
                : "rgba(75, 192, 192, 0)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: chartType === "line" ? false : true,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 1000, // duration of animations in milliseconds
          easing: "easeInOutQuad", // easing function for animations
        },
      },
    });
  }

  function saveData() {
    localStorage.setItem("months", JSON.stringify(months));
    localStorage.setItem("balances", JSON.stringify(balances));
  }

  // Initialize the graph with data from localStorage
  updateGraph();
});
