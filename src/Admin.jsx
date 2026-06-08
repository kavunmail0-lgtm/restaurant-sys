import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "menu"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMenu(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (!name || !price) {
      alert("Enter dish name and price");
      return;
    }

    await addDoc(collection(db, "menu"), {
      name,
      price: Number(price),
    });

    setName("");
    setPrice("");
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "menu", id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>👨‍💼 Admin Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Dish Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <button onClick={addItem}>
          Add Dish
        </button>
      </div>

      <h2>Menu Items</h2>

      {menu.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>{item.name}</strong> - ₹{item.price}

          <button
            onClick={() => deleteItem(item.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;