import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function SalesReport() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const paidOrders = data.filter(
          (order) => order.status === "Paid"
        );

        setOrders(paidOrders);
      }
    );

    return () => unsubscribe();
  }, []);

  const getTotal = (items) => {
    return items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + getTotal(order.items),
    0
  );

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h1>💰 Sales Report</h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Total Orders: {orders.length}</h2>
        <h2>Total Revenue: ₹{totalRevenue}</h2>
      </div>

      <h2>Recent Paid Orders</h2>

      {orders.length === 0 ? (
        <p>No Paid Orders</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "white",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🍽 Table {order.tableNo}</h3>

            {order.items?.map((item, index) => (
              <div key={index}>
                {item.name} × {item.qty} = ₹
                {item.price * item.qty}
              </div>
            ))}

            <hr />

            <h3>Total: ₹{getTotal(order.items)}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default SalesReport;