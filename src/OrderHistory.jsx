import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
const [selectedDate, setSelectedDate] = useState("");
const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Only PAID orders show pannum
      setOrders(data.filter((o) => o.status === "Paid"));
    });

    return () => unsub();
  }, []);

  const getTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const totalRevenue = orders.reduce(
  (sum, order) => sum + getTotal(order.items),
  0
);

const totalOrders = orders.length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📜 Order History</h1>

<button
  style={{
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px"
  }}
>
  🗑 Delete Selected
</button>

<select
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  style={{
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px"
  }}
>
  <option value="">All Dates</option>

  {[...new Set(orders.map((o) => o.orderDate))]
    .filter(Boolean)
    .map((date) => (
      <option key={date} value={date}>
        {date}
      </option>
    ))}
</select>
    
      <div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  <div
    style={{
      background: "white",
      padding: "15px",
      borderRadius: "12px",
    }}
  >
    <h3>Total Orders</h3>
    <h2>{totalOrders}</h2>
  </div>

  <div
    style={{
      background: "white",
      padding: "15px",
      borderRadius: "12px",
    }}
  >
    <h3>Total Revenue</h3>
    <h2>₹{totalRevenue}</h2>
  </div>
</div>

      {orders.length === 0 && <p>No Paid Orders</p>}

      {orders
  .filter(
    (order) =>
      !selectedDate ||
      order.orderDate === selectedDate
  )
  .map((order) => (

        <div
          key={order.id}
          style={{
            background: "white",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <input
  type="checkbox"
  checked={selectedOrders.includes(order.id)}
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedOrders([
        ...selectedOrders,
        order.id,
      ]);
    } else {
      setSelectedOrders(
        selectedOrders.filter(
          (id) => id !== order.id
        )
      );
    }
  }}
/>

          <h3>🍽 Table {order.tableNo}</h3>

<p>
  📅 {order.orderDate || "Old Order"} | 🕒 {order.orderTime || ""}
</p>

          {order.items?.map((item, i) => (
            <div key={i}>
              {item.name} x {item.qty} = ₹{item.price * item.qty}
            </div>
          ))}

          <h4>Total: ₹{getTotal(order.items)}</h4>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;