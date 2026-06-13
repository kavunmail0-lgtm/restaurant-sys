import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function Waiter() {
  const [orders, setOrders] = useState([]);
  const firstLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const readyOrders = data.filter(
          (order) => order.status === "Ready"
        );

        // 🔔 Sound when a new Ready order appears
        if (!firstLoad.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              const order = change.doc.data();

              if (order.status === "Ready") {
                const audio = new Audio("/notification.mp3");
                audio.play().catch((err) => {
                  console.log("Audio blocked:", err);
                });
              }
            }
          });
        }

        firstLoad.current = false;
        setOrders(readyOrders);
      }
    );

    return () => unsubscribe();
  }, []);

  const markServed = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "Served",
    });

    alert("Order Served");
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
    color: "#22c55e",
    fontSize: "42px",
    marginBottom: "30px"
  }}
>
  🤵 Waiter Dashboard
</h1>

      {orders.length === 0 && (
        <p
  style={{
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b"
  }}
>
  🚫 No Ready Orders
</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
}}
        >
         <h3>
  🍽 Table {order.tableNo}
</h3>

          <p
  style={{
    fontWeight: "bold",
    color: "#22c55e"
  }}
>
  🟢 Ready To Serve
</p>

          <h4>Items</h4>

          {order.items?.map((item, index) => (
            <div key={index}>
              {item.name} x {item.qty}
            </div>
          ))}

         <button
  onClick={() => markServed(order.id)}
  style={{
    marginTop: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  ✅ Mark Served
</button>
        </div>
      ))}
    </div>
  );
}

export default Waiter;