import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

function Customer() {
  const [tableNo, setTableNo] = useState("1");
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const menu = [
    { name: "Burger", price: 120 },
    { name: "Pizza", price: 250 },
    { name: "Coke", price: 40 },
    { name: "French Fries", price: 90 }
  ];

  const addToCart = (item) => {
    const existing = cart.find((i) => i.name === item.name);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.name === item.name
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const docRef = await addDoc(collection(db, "orders"), {
      tableNo: Number(tableNo),
      items: cart,
      status: "Pending",
      createdAt: new Date()
    });

    setOrderId(docRef.id);
    setOrderStatus("Pending");

    alert("Order Placed Successfully!");
    setCart([]);
  };

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = onSnapshot(
      doc(db, "orders", orderId),
      (snapshot) => {
        if (snapshot.exists()) {
          setOrderStatus(snapshot.data().status);
        }
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Dashboard</h1>

      <div>
        <label>Table No: </label>
        <input
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
        />
      </div>

      <h2>Menu</h2>

      {menu.map((item) => (
        <div
          key={item.name}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          {item.name} - ₹{item.price}

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => addToCart(item)}
          >
            Add
          </button>
        </div>
      ))}

      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>No items added</p>
      ) : (
        cart.map((item) => (
          <div key={item.name}>
            {item.name} x {item.qty}
          </div>
        ))
      )}

      <button
        onClick={placeOrder}
        style={{ marginTop: "20px" }}
      >
        Place Order
      </button>

      {orderStatus && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "10px"
          }}
        >
          <h3>Order Status</h3>

          <p>
            {orderStatus === "Pending" && "🟡 Pending"}
            {orderStatus === "Preparing" && "🟠 Preparing"}
            {orderStatus === "Ready" && "🟢 Ready"}
            {orderStatus === "Served" && "✅ Served"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Customer;