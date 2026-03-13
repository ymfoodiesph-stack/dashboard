const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxa_rV_SLt4DPaxCiRUghHLYnGFEdhSl4q49BkWTaQd2lwdFV3necxMermlPWZAc1Thg/exec";

// Load orders
async function loadOrders() {
  const tbody = document.querySelector("#orders-table tbody");
  if (!tbody) return;

  try {
    const res = await fetch(`${SCRIPT_URL}?action=orders`);
    const orders = await res.json();

    if (!orders || orders.length === 0) {
      tbody.innerHTML = "<tr><td colspan='9'>No orders yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";

    orders.forEach((o, idx) => {
      tbody.innerHTML += `
        <tr>
          <td>${o.Timestamp}</td>
          <td>${o.ProductID}</td>
          <td>${o.Name}</td>
          <td>${o.Phone}</td>
          <td>${o.Qty}</td>
          <td>₱${o.Total}</td>
          <td>₱${o.Profit}</td>
          <td>${o.Status}</td>
          <td>
            <select onchange="updateStatus('${o.Timestamp}', this.value)">
              <option value="Pending" ${o.Status==='Pending'?'selected':''}>Pending</option>
              <option value="In Progress" ${o.Status==='In Progress'?'selected':''}>In Progress</option>
              <option value="Completed" ${o.Status==='Completed'?'selected':''}>Completed</option>
            </select>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error loading orders:", err);
  }
}

// Update order status
async function updateStatus(timestamp, status) {
  try {
    const payload = {
      action: "updateOrderStatus",
      data: { timestamp, status }
    };

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      alert("Status updated!");
      loadOrders();
    }
  } catch (err) {
    console.error("Error updating status:", err);
    alert("Failed to update status");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", loadOrders);
