const db = require("../config/db");

// GET all customers
const getAllCustomers = (req, res) => {
  const sql = "SELECT * FROM customers";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    res.status(200).json(results);
  });
};

// GET one customer by id
const getCustomerById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM customers WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json(results[0]);
  });
};

// POST new customer
const createCustomer = (req, res) => {
  const {
    full_name,
    email,
    phone,
    source,
    last_contact,
    next_follow_up
  } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({
      message: "full_name and email are required"
    });
  }

  const sql = `
    INSERT INTO customers (
      full_name,
      email,
      phone,
      source,
      last_contact,
      next_follow_up,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      full_name,
      email,
      phone || null,
      source || null,
      last_contact || null,
      next_follow_up || null,
      "New"
    ],
    (err, result) => {
      if (err) {
        console.error("Create customer error:", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      res.status(201).json({
        message: "Customer created successfully",
        customerId: result.insertId
      });
    }
  );
};

// PUT update customer
const updateCustomer = (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    email,
    phone,
    source,
    last_contact,
    next_follow_up
  } = req.body;

  const sql = `
    UPDATE customers
    SET full_name = ?, email = ?, phone = ?, source = ?, last_contact = ?, next_follow_up = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      full_name,
      email,
      phone || null,
      source || null,
      last_contact || null,
      next_follow_up || null,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("Update customer error:", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Customer not found"
        });
      }

      res.status(200).json({
        message: "Customer updated successfully"
      });
    }
  );
};

const deleteCustomer = (req, res) => {
  const { id } = req.params;

  const deleteTasksSql = "DELETE FROM tasks WHERE customer_id = ?";
  const deleteInteractionsSql = "DELETE FROM interactions WHERE customer_id = ?";
  const deleteCustomerSql = "DELETE FROM customers WHERE id = ?";

  db.query(deleteTasksSql, [id], (taskErr) => {
    if (taskErr) {
      console.error("Delete tasks error:", taskErr);
      return res.status(500).json({
        message: "Database error",
        error: taskErr.message
      });
    }

    db.query(deleteInteractionsSql, [id], (interactionErr) => {
      if (interactionErr) {
        console.error("Delete interactions error:", interactionErr);
        return res.status(500).json({
          message: "Database error",
          error: interactionErr.message
        });
      }

      db.query(deleteCustomerSql, [id], (customerErr, result) => {
        if (customerErr) {
          console.error("Delete customer error:", customerErr);
          return res.status(500).json({
            message: "Database error",
            error: customerErr.message
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Customer not found"
          });
        }

        res.status(200).json({
          message: "Customer deleted successfully"
        });
      });
    });
  });
};
const escapeCSVValue = (value) => {
  if (value === null || value === undefined) return "";

  const text = value instanceof Date
    ? value.toISOString()
    : String(value);

  // Bọc mỗi giá trị bằng dấu " và escape dấu " bên trong dữ liệu
  return `"${text.replace(/"/g, '""')}"`;
};

const exportCustomersCSV = (req, res) => {
  const sql = `
    SELECT id, full_name, email, phone, source, status, created_at
    FROM customers
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("EXPORT ERROR:", err);
      return res.status(500).json({
        message: "Export CSV failed",
        error: err.message
      });
    }

    const header = ["ID", "Full Name", "Email", "Phone", "Source", "Status", "Created At"];

    const dataRows = rows.map((c) => [
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.source,
      c.status,
      c.created_at ? new Date(c.created_at).toISOString() : ""
    ]);

    const csv = "\uFEFF" + [
      header.join(","),
      ...dataRows.map((row) => row.map(escapeCSVValue).join(","))
    ].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="customers.csv"');

    return res.status(200).send(csv);
  });
};
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomersCSV
};