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
    <div style={{ padding: "20px" }}>
      <h1>👨‍🍳 Waiter Dashboard</h1>

      {orders.length === 0 && (
        <p>No Ready Orders</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>Table {order.tableNo}</h3>

          <p>Status: {order.status}</p>

          <h4>Items</h4>

          {order.items?.map((item, index) => (
            <div key={index}>
              {item.name} x {item.qty}
            </div>
          ))}

          <button
            onClick={() => markServed(order.id)}
            style={{
              marginTop: "10px",
            }}
          >
            Served
          </button>
        </div>
      ))}
    </div>
  );
}

export default Waiter;