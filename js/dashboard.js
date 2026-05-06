const API_BASE_URL = "http://localhost:5000/api";

const totalCustomersEl = document.getElementById("totalCustomers");
const totalInteractionsEl = document.getElementById("totalInteractions");
const totalTasksEl = document.getElementById("totalTasks");
const totalNewCustomersEl = document.getElementById("totalNewCustomers");
const dashboardMessageEl = document.getElementById("dashboardMessage");
const refreshDashboardBtn = document.getElementById("refreshDashboardBtn");

const statusChartMessageEl = document.getElementById("statusChartMessage");
const growthChartMessageEl = document.getElementById("growthChartMessage");
const customerStatusTableBody = document.getElementById("customerStatusTableBody");
const customerGrowthTableBody = document.getElementById("customerGrowthTableBody");

let customerStatusChart = null;
let customerGrowthChart = null;

async function loadDashboardSummary() {
  try {
    if (dashboardMessageEl) {
      dashboardMessageEl.textContent = "Loading dashboard data...";
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/summary`);

    if (!response.ok) {
      throw new Error("Failed to load dashboard summary.");
    }

    const data = await response.json();

    if (totalCustomersEl) totalCustomersEl.textContent = data.totalCustomers ?? 0;
    if (totalInteractionsEl) totalInteractionsEl.textContent = data.totalInteractions ?? 0;
    if (totalTasksEl) totalTasksEl.textContent = data.totalTasks ?? 0;
    if (totalNewCustomersEl) totalNewCustomersEl.textContent = data.totalNewCustomers ?? 0;

    if (dashboardMessageEl) {
      dashboardMessageEl.textContent = "";
    }
  } catch (error) {
    if (totalCustomersEl) totalCustomersEl.textContent = "-";
    if (totalInteractionsEl) totalInteractionsEl.textContent = "-";
    if (totalTasksEl) totalTasksEl.textContent = "-";
    if (totalNewCustomersEl) totalNewCustomersEl.textContent = "-";

    if (dashboardMessageEl) {
      dashboardMessageEl.textContent = "Cannot load dashboard data.";
    }

    console.error("Dashboard summary error:", error);
  }
}

async function loadCustomerStatusChart() {
  try {
    if (statusChartMessageEl) {
      statusChartMessageEl.textContent = "Loading customer status chart...";
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/customers-by-status`);

    if (!response.ok) {
      throw new Error("Failed to load customer status statistics.");
    }

    const result = await response.json();
    const data = result.data || [];

    renderCustomerStatusChart(data);
    renderCustomerStatusTable(data);

    if (statusChartMessageEl) {
      statusChartMessageEl.textContent = "";
    }
  } catch (error) {
    if (statusChartMessageEl) {
      statusChartMessageEl.textContent = "Cannot load customer status chart.";
    }

    if (customerStatusTableBody) {
      customerStatusTableBody.innerHTML = `<tr><td colspan="2">No data available.</td></tr>`;
    }

    console.error("Customer status chart error:", error);
  }
}

async function loadCustomerGrowthChart() {
  try {
    if (growthChartMessageEl) {
      growthChartMessageEl.textContent = "Loading customer growth chart...";
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/customers-growth-last-six-months`);

    if (!response.ok) {
      throw new Error("Failed to load customer growth statistics.");
    }

    const result = await response.json();
    const data = result.data || [];

    renderCustomerGrowthChart(data);
    renderCustomerGrowthTable(data);

    if (growthChartMessageEl) {
      growthChartMessageEl.textContent = "";
    }
  } catch (error) {
    if (growthChartMessageEl) {
      growthChartMessageEl.textContent = "Cannot load customer growth chart.";
    }

    if (customerGrowthTableBody) {
      customerGrowthTableBody.innerHTML = `<tr><td colspan="2">No data available.</td></tr>`;
    }

    console.error("Customer growth chart error:", error);
  }
}

function renderCustomerStatusChart(data) {
  const canvas = document.getElementById("customerStatusChart");
  if (!canvas) return;

  const labels = data.map((item) => item.status);
  const values = data.map((item) => Number(item.totalCustomers) || 0);

  if (customerStatusChart) {
    customerStatusChart.destroy();
  }

  customerStatusChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Customers",
          data: values,
          backgroundColor: [
            "#3ba4e7",
            "#fb5b82",
            "#ffa23a",
            "#ffd25a",
            "#45b8bd",
            "#9b5de5",
            "#c7c7c7"
          ],
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function renderCustomerGrowthChart(data) {
  const canvas = document.getElementById("customerGrowthChart");
  if (!canvas) return;

  const labels = data.map((item) => item.month);
  const values = data.map((item) => Number(item.totalCustomers) || 0);

  if (customerGrowthChart) {
    customerGrowthChart.destroy();
  }

  customerGrowthChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Customers Added",
          data: values,
          backgroundColor: "rgba(104, 180, 226, 0.72)",
          borderColor: "rgba(104, 180, 226, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          position: "top"
        }
      }
    }
  });
}

function renderCustomerStatusTable(data) {
  if (!customerStatusTableBody) return;

  if (!data.length) {
    customerStatusTableBody.innerHTML = `<tr><td colspan="2">No data available.</td></tr>`;
    return;
  }

  customerStatusTableBody.innerHTML = data
    .map(
      (item) => `
        <tr>
          <td>${item.status}</td>
          <td>${item.totalCustomers}</td>
        </tr>
      `
    )
    .join("");
}

function renderCustomerGrowthTable(data) {
  if (!customerGrowthTableBody) return;

  if (!data.length) {
    customerGrowthTableBody.innerHTML = `<tr><td colspan="2">No data available.</td></tr>`;
    return;
  }

  customerGrowthTableBody.innerHTML = data
    .map(
      (item) => `
        <tr>
          <td>${item.month}</td>
          <td>${item.totalCustomers}</td>
        </tr>
      `
    )
    .join("");
}

async function loadDashboard() {
  await loadDashboardSummary();
  await Promise.all([
    loadCustomerStatusChart(),
    loadCustomerGrowthChart()
  ]);
}

if (refreshDashboardBtn) {
  refreshDashboardBtn.addEventListener("click", loadDashboard);
}

loadDashboard();
