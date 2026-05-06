const db = require("../config/db");

const getDashboardSummary = (req, res) => {
  const summary = {};

  const totalCustomersSql = "SELECT COUNT(*) AS totalCustomers FROM customers";
  const totalInteractionsSql = "SELECT COUNT(*) AS totalInteractions FROM interactions";
  const totalTasksSql = "SELECT COUNT(*) AS totalTasks FROM tasks";
  const totalNewCustomersSql =
    "SELECT COUNT(*) AS totalNewCustomers FROM customers WHERE status = 'New'";

  db.query(totalCustomersSql, (err, customerResult) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    summary.totalCustomers = customerResult[0].totalCustomers;

    db.query(totalInteractionsSql, (err, interactionResult) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      summary.totalInteractions = interactionResult[0].totalInteractions;

      db.query(totalTasksSql, (err, taskResult) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        summary.totalTasks = taskResult[0].totalTasks;

        db.query(totalNewCustomersSql, (err, newCustomerResult) => {
          if (err) {
            return res.status(500).json({
              message: "Database error",
              error: err.message
            });
          }

          summary.totalNewCustomers = newCustomerResult[0].totalNewCustomers;

          res.status(200).json(summary);
        });
      });
    });
  });
};

const getCustomerStatusStats = (req, res) => {
  const sql = `
    SELECT
      TRIM(status) AS status,
      COUNT(*) AS totalCustomers
    FROM customers
    GROUP BY TRIM(status)
    ORDER BY totalCustomers DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    res.status(200).json({
      data: results.map((item) => ({
        status: item.status || "Unknown",
        totalCustomers: item.totalCustomers
      }))
    });
  });
};

const getCustomerMonthlyStats = (req, res) => {
  const selectedYear = Number(req.query.year) || new Date().getFullYear();

  const sql = `
    SELECT
      MONTH(created_at) AS monthNumber,
      COUNT(*) AS totalCustomers
    FROM customers
    WHERE YEAR(created_at) = ?
    GROUP BY MONTH(created_at)
    ORDER BY MONTH(created_at)
  `;

  db.query(sql, [selectedYear], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    const monthlyStats = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      const matchedMonth = results.find(
        (item) => Number(item.monthNumber) === monthNumber
      );

      return {
        month: `Month ${monthNumber}`,
        monthNumber,
        totalCustomers: matchedMonth ? matchedMonth.totalCustomers : 0
      };
    });

    res.status(200).json({
      year: selectedYear,
      data: monthlyStats
    });
  });
};

const getCustomerGrowthLastSixMonths = (req, res) => {
  const sql = `
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS monthLabel,
      COUNT(*) AS totalCustomers
    FROM customers
    WHERE created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01')
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY monthLabel
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    const now = new Date();
    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const matchedMonth = results.find((item) => item.monthLabel === monthLabel);

      lastSixMonths.push({
        month: monthLabel,
        totalCustomers: matchedMonth ? matchedMonth.totalCustomers : 0
      });
    }

    res.status(200).json({
      data: lastSixMonths
    });
  });
};

module.exports = {
  getDashboardSummary,
  getCustomerStatusStats,
  getCustomerMonthlyStats,
  getCustomerGrowthLastSixMonths
};
