const API_BASE_URL = "http://localhost:5000/api";

const customerTableBody = document.getElementById("customerTableBody");
const customerMessage = document.getElementById("customerMessage");

function getStatusBadgeClass(status) {
  switch (status) {
    case "Interested":
      return "badge badge-warning";
    case "Contacted":
      return "badge badge-info";
    case "New":
      return "badge badge-neutral";
    case "Purchased":
      return "badge badge-success";
    case "Inactive":
      return "badge badge-danger";
    default:
      return "badge";
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getAvatarLetter(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function getCustomerName(customer) {
  return customer.full_name || customer.name || "";
}

async function deleteCustomer(customerId) {
  const confirmed = confirm("Are you sure you want to delete this customer?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (response.ok) {
      alert("Customer deleted successfully!");
      loadCustomers();
    } else {
      alert(data.message || "Failed to delete customer.");
    }
  } catch (error) {
    alert("Cannot connect to server.");
    console.error(error);
  }
}

async function loadCustomers() {
  if (!customerTableBody || !customerMessage) return;

  customerMessage.textContent = "Loading customers...";
  customerTableBody.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    const customers = await response.json();

    if (!response.ok) {
      customerMessage.textContent =
        customers.message || "Failed to load customers.";
      return;
    }

    if (!Array.isArray(customers) || customers.length === 0) {
      customerMessage.textContent = "No customers found.";
      return;
    }

    customerMessage.textContent = "";

    customers.forEach((customer) => {
      const displayName = getCustomerName(customer);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <div class="customer-cell">
            <div class="customer-avatar">${getAvatarLetter(displayName)}</div>
            <div>
              <strong>${displayName}</strong>
              <p>${customer.email || ""}</p>
            </div>
          </div>
        </td>
        <td>${customer.phone || ""}</td>
        <td>
          <span class="${getStatusBadgeClass(customer.status)}">
            ${customer.status || ""}
          </span>
        </td>
        <td>${customer.source || ""}</td>
        <td>${formatDate(customer.last_contact)}</td>
        <td>${formatDate(customer.next_follow_up)}</td>
        <td class="actions-cell">
          <a href="customer-detail.html?id=${customer.id}" class="btn btn-sm">View</a>
          <a href="customer-form.html?id=${customer.id}" class="text-link">Edit</a>
          <button type="button" class="text-link delete-btn" data-id="${customer.id}">Delete</button>
        </td>
      `;

      customerTableBody.appendChild(row);

      const deleteBtn = row.querySelector(".delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          deleteCustomer(customer.id);
        });
      }
    });
  } catch (error) {
    customerMessage.textContent = "Cannot connect to server.";
    console.error(error);
  }
}

loadCustomers();
function exportCSV() {
  window.open("http://localhost:5000/api/customers/export/csv");
}