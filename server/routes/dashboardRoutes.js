const express = require("express");
const router = express.Router();
const {
  getDashboardSummary,
  getCustomerStatusStats,
  getCustomerMonthlyStats,
  getCustomerGrowthLastSixMonths
} = require("../controllers/dashboardController");

router.get("/summary", getDashboardSummary);
router.get("/customers-by-status", getCustomerStatusStats);
router.get("/customers-by-month", getCustomerMonthlyStats);
router.get("/customers-growth-last-six-months", getCustomerGrowthLastSixMonths);

module.exports = router;
