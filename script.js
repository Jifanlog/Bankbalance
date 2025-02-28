// This file contains the JavaScript code that handles user input, processes the bank balance data, and generates the graph.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("balance-form");
  const balanceInput = document.getElementById("balance");
  const monthInput = document.getElementById("month");
  const clearButton = document.getElementById("clear-button");
  const removeLastButton = document.getElementById("remove-last-button");
  const ctx = document.getElementById("balanceChart").getContext("2d");
  let balances = JSON.parse(localStorage.getItem("balances")) || [];
  let months = JSON.parse(localStorage.getItem("months")) || [];

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

  function updateGraph() {
    if (window.barGraph) {
      window.barGraph.destroy();
    }
    window.barGraph = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Bank Balance",
            data: balances,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
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
