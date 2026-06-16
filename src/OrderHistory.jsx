import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>📜 Order History</h1>

      {orders.length === 0 && <p>No Paid Orders</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>🍽 Table {order.tableNo}</h3>

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