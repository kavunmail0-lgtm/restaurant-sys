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
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "menu"),
      (snapshot) => {
        const menuData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMenu(menuData);
      }
    );

    return () => unsubscribe();
  }, []);

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

  const getTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
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
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px"
      }}
    >
      <h1
  style={{
    textAlign: "center",
    color: "#ea580c",
    marginBottom: "20px",
    fontSize: "42px"
  }}
>
  🍽 Smart Restaurant
</h1>

      <div
        style={{
          background: "#ffffff",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <label>Table Number</label>

        <input
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            borderRadius: "8px",
            border: "1px solid #ddd"
          }}
        />
      </div>

      <h2>🍔 Menu</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px"
        }}
      >
        {menu.map((item) => (
          <div
            key={item.id}
            style={{
             background: "#ffffff",
border: "2px solid #fed7aa",
              borderRadius: "15px",
              padding: "15px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{item.name}</h3>

            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ea580c",
              }}
            >
              ₹{item.price}
            </p>

            <button
              onClick={() => addToCart(item)}
              style={{
               background: "#f97316",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#eff6ff",
          marginTop: "25px",
          padding: "20px",
          borderRadius: "15px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2>🛒 Cart</h2>

        {cart.length === 0 ? (
          <p>No items added</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.name}
              style={{
                marginBottom: "8px"
              }}
            >
              {item.name} x {item.qty}
            </div>
          ))
        )}

        <h3 style={{ marginTop: "15px" }}>
          Total: ₹{getTotal()}
        </h3>

        <button
          onClick={placeOrder}
          style={{
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "15px",
            width: "100%"
          }}
        >
          Place Order
        </button>
      </div>

      {orderStatus && (
        <div
          style={{
            background: "#f8fafc",
            marginTop: "20px",
            padding: "15px",
            borderRadius: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)"
          }}
        >
          <h3>📦 Order Status</h3>

<p
  style={{
    fontWeight: "bold",
    fontSize: "18px"
  }}
>
  {orderStatus === "Pending" && (
    <span style={{ color: "#eab308" }}>
      🟡 Pending
    </span>
  )}

  {orderStatus === "Preparing" && (
    <span style={{ color: "#f97316" }}>
      🟠 Preparing
    </span>
  )}

  {orderStatus === "Ready" && (
    <span style={{ color: "#22c55e" }}>
      🟢 Ready
    </span>
  )}

  {orderStatus === "Served" && (
    <span style={{ color: "#2563eb" }}>
      ✅ Served
    </span>
  )}
</p>
        </div>
      )}
    </div>
  );
}

export default Customer;