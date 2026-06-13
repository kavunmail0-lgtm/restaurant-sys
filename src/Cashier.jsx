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
    <div
  style={{
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px",
    background: "#f8fafc",
    minHeight: "100vh"
  }}
>
      <h1
  style={{
    textAlign: "center",
    color: "#16a34a",
    fontSize: "42px",
    marginBottom: "30px"
  }}
>
  💰 Cashier Dashboard
</h1>

      {orders.length === 0 && (
        <p
  style={{
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b"
  }}
>
  🧾 No Served Orders
</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
         style={{
  background: "white",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
}}
        >
          <h3>
  🍽 Table {order.tableNo}
</h3>

<p
  style={{
    color: "#16a34a",
    fontWeight: "bold"
  }}
>
  ✅ Served - Ready for Billing
</p>

          {order.items?.map((item, index) => (
  <div
    key={index}
    style={{
      padding: "8px 0",
      borderBottom: "1px solid #e5e7eb"
    }}
  >
    {item.name} × {item.qty}
    {" = "}
    ₹{item.price * item.qty}
  </div>
))}

          <hr />

          <h3
  style={{
    color: "#16a34a",
    fontSize: "24px"
  }}
>
  💰 Total: ₹{getTotal(order.items)}
</h3>
        </div>
      ))}
    </div>
  );
}

export default Cashier;