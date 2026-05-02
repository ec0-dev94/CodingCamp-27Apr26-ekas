// DOM Elements
const balance = document.getElementById("total-balance");
const list = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const pieChart = document.getElementById("pie-chart");
const legend = document.getElementById("chart-legend");
const themeToggle = document.getElementById("theme-toggle");
const sortSelect = document.getElementById("sort-select");
const totalItemsEl = document.getElementById("total-items");
const avgSpendingEl = document.getElementById("avg-spending");

// Dark Mode Toggle
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);
if (themeToggle)
  themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
}

const categoryColors = {
  Food: "#2ecc71",
  Transport: "#3498db",
  Fun: "#e67e22",
  Shopping: "#9b59b6",
};

// Load data dengan error handling
let transactions = [];
let sortOrder = localStorage.getItem("sortOrder") || "date-desc";

try {
  const savedTransactions = localStorage.getItem("transactions");
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    console.log("✅ Loaded", transactions.length, "transactions");
  }
} catch (error) {
  console.error("❌ Load error, clearing storage:", error);
  localStorage.removeItem("transactions");
  transactions = [];
}

// Save function dengan validation
function updateLocalStorage() {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("sortOrder", sortOrder);
    console.log("💾 Saved", transactions.length, "items");
  } catch (error) {
    console.error("💾 Save failed:", error);
  }
}

// Sort transactions
function sortTransactions() {
  transactions.forEach((t) => {
    if (!t.timestamp) t.timestamp = Date.now();
  });

  const sorts = {
    "date-desc": (a, b) => b.timestamp - a.timestamp,
    "date-asc": (a, b) => a.timestamp - b.timestamp,
    "amount-desc": (a, b) => b.amount - a.amount,
    "amount-asc": (a, b) => a.amount - b.amount,
    "text-asc": (a, b) => a.text.localeCompare(b.text),
    "text-desc": (a, b) => b.text.localeCompare(a.text),
    "category-asc": (a, b) => a.category.localeCompare(b.category),
    "category-desc": (a, b) => b.category.localeCompare(a.category),
  };

  transactions.sort(sorts[sortOrder] || sorts["date-desc"]);
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now() + Math.random() * 1000,
    text: text.value.trim(),
    amount: +amount.value,
    category: category.value,
    timestamp: Date.now(),
  };

  if (transaction.text && transaction.amount > 0) {
    transactions.push(transaction);
    updateLocalStorage(); // Save IMMEDIATE
    form.reset();
    init();
  }
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage(); // Save IMMEDIATE
  init();
}

// Update balance
function updateValues() {
  if (!balance) return;
  const total = transactions
    .reduce((acc, item) => acc + item.amount, 0)
    .toFixed(2);
  balance.textContent = `$${total}`;
}

// Update chart & stats
function updateChart() {
  const totalItems = transactions.length;
  const totalAmount = transactions.reduce((acc, item) => acc + item.amount, 0);
  const avgSpending =
    totalItems > 0 ? (totalAmount / totalItems).toFixed(2) : "0.00";

  if (totalItemsEl) totalItemsEl.textContent = totalItems;
  if (avgSpendingEl) avgSpendingEl.textContent = `$${avgSpending}`;

  // Pie chart
  const summary = {};
  transactions.forEach((item) => {
    summary[item.category] = (summary[item.category] || 0) + item.amount;
  });

  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  let currentPercent = 0;
  const gradientParts = [];

  if (legend) legend.innerHTML = "";

  Object.entries(summary).forEach(([cat, val]) => {
    const percent = total > 0 ? (val / total) * 100 : 0;
    const color = categoryColors[cat];
    gradientParts.push(
      `${color} ${currentPercent}% ${currentPercent + percent}%`,
    );
    currentPercent += percent;

    if (legend) {
      legend.innerHTML += `
        <div class="legend-item">
          <span class="dot" style="background:${color}"></span>
          ${cat}: $${val.toFixed(2)} (${percent.toFixed(1)}%)
        </div>
      `;
    }
  });

  if (pieChart) {
    pieChart.style.background =
      transactions.length > 0
        ? `conic-gradient(${gradientParts.join(", ")})`
        : "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)";
  }
}

// Render list
function renderList() {
  if (!list) return;
  list.innerHTML =
    transactions.length === 0
      ? '<li style="text-align:center;color:var(--text-muted);padding:40px;font-style:italic;">No transactions yet</li>'
      : transactions
          .map(
            (t) => `
      <li data-category="${t.category}">
        <div class="item-info">
          <h4>${t.text}</h4>
          <p>$${t.amount.toFixed(2)}</p>
          <span class="item-category">${t.category}</span>
        </div>
        <button class="btn-delete" onclick="removeTransaction(${t.id})">×</button>
      </li>
    `,
          )
          .join("");
}

// 🔥 SINGLE INIT FUNCTION (NO DUPLICATE!)
function init() {
  console.log("🔄 Init with", transactions.length, "transactions");
  sortTransactions();
  renderList();
  updateValues();
  updateChart();
  if (sortSelect) sortSelect.value = sortOrder;
}

// Event Listeners
if (form) form.addEventListener("submit", addTransaction);
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    sortOrder = e.target.value;
    sortTransactions();
    renderList();
    updateLocalStorage();
  });
}

// Load on DOM ready
document.addEventListener("DOMContentLoaded", init);

// Debug info
console.log("🚀 Script loaded. Transactions:", transactions.length);
