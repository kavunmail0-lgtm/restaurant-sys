import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
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

  const totalRevenue = orders.reduce(
  (sum, order) => sum + getTotal(order.items),
  0
);

  const markPaid = async (id) => {
  await updateDoc(doc(db, "orders", id), {
    status: "Paid",
  });

  alert("Payment Completed");
};

const downloadBill = (order) => {
  const pdf = new jsPDF();

  pdf.text("Restaurant Bill", 20, 20);
  pdf.text(`Table: ${order.tableNo}`, 20, 35);

  let y = 50;

  order.items.forEach((item) => {
    pdf.text(
      `${item.name} x ${item.qty} = ₹${item.price * item.qty}`,
      20,
      y
    );
    y += 10;
  });

  pdf.text(
    `Total: ₹${getTotal(order.items)}`,
    20,
    y + 10
  );

  pdf.save(`Bill-Table-${order.tableNo}.pdf`);
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

     <div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  }}
>
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "15px",
      flex: 1,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}
  >
    <h3>Total Orders</h3>
    <h2>{orders.length}</h2>
  </div>

  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "15px",
      flex: 1,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}
  >
    <h3>Total Revenue</h3>
    <h2>₹{totalRevenue}</h2>
  </div>
</div>

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

         <button
  onClick={() => markPaid(order.id)}
  style={{
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px"
  }}
>
  💳 Mark Paid
</button>

<button
  onClick={() => downloadBill(order)}
  style={{
    marginLeft: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer"
  }}
>
  📄 Download Bill
</button>

        </div>
      ))}
    </div>
  );
}

export default Cashier;