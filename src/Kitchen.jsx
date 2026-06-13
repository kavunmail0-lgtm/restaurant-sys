import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

function Kitchen() {
  const [orders, setOrders] = useState([]);
  const firstLoad = useRef(true);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status: status,
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 🔔 Sound only for newly added orders
        if (!firstLoad.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const audio = new Audio("/notification.mp3");
              audio.play().catch((err) => {
                console.log("Audio blocked:", err);
              });
            }
          });
        }

        firstLoad.current = false;
        setOrders(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const kitchenOrders = orders.filter(
    (order) =>
      order.status !== "Ready" &&
      order.status !== "Served"
  );

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
    color: "#f97316",
    fontSize: "42px",
    marginBottom: "30px"
  }}
>
  👨‍🍳 Kitchen Dashboard
</h1>
      {kitchenOrders.map((order) => (
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

          <p style={{ fontWeight: "bold" }}>
  {order.status === "Pending" && "🟡 Pending"}
  {order.status === "Preparing" && "🟠 Preparing"}
</p>

          {order.items?.map((item, index) => (
            <div key={index}>
              {item.name} x {item.qty}
            </div>
          ))}

          <div style={{ marginTop: "10px" }}>
            <button
  onClick={() => updateStatus(order.id, "Preparing")}
  style={{
    background: "#f97316",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  🟠 Preparing
</button>

           <button
  onClick={() => updateStatus(order.id, "Ready")}
  style={{
    marginLeft: "10px",
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  ✅ Ready
</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Kitchen;