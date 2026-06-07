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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kitchen Dashboard</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>Table {order.tableNo}</h3>

          <p>Status: {order.status}</p>

          {order.items?.map((item, index) => (
            <div key={index}>
              {item.name} x {item.qty}
            </div>
          ))}

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => updateStatus(order.id, "Preparing")}
            >
              Preparing
            </button>

            <button
              onClick={() => updateStatus(order.id, "Ready")}
              style={{ marginLeft: "10px" }}
            >
              Ready
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Kitchen;