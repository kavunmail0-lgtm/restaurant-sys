import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function Cashier() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const servedOrders = data.filter(
          (order) => order.status === "Served"
        );

        setOrders(servedOrders);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>💰 Cashier Dashboard</h1>

      {orders.length === 0 && (
        <p>No Served Orders</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>Table {order.tableNo}</h3>

          {order.items?.map((item, index) => (
            <div key={index}>
              {item.name} x {item.qty} = ₹
              {item.price * item.qty}
            </div>
          ))}

          <hr />

          <h3>Total: ₹{getTotal(order.items)}</h3>
        </div>
      ))}
    </div>
  );
}

export default Cashier;