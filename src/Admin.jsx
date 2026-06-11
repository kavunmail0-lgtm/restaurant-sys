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
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const unsubMenu = onSnapshot(
      collection(db, "menu"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMenu(data);
      }
    );

    const unsubCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(data);

        if (data.length > 0 && !category) {
          setCategory(data[0].name);
        }
      }
    );

    return () => {
      unsubMenu();
      unsubCategories();
    };
  }, []);

  const addCategory = async () => {
    if (!newCategory) return;

    await addDoc(collection(db, "categories"), {
      name: newCategory,
    });

    setNewCategory("");
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));
  };

  const addItem = async () => {
    if (!name || !price || !category) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "menu"), {
      name,
      price: Number(price),
      category,
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

      <h2>📂 Categories</h2>

      <input
        placeholder="Category Name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />

      <button
        onClick={addCategory}
        style={{ marginLeft: "10px" }}
      >
        Add Category
      </button>

      {categories.map((cat) => (
        <div key={cat.id} style={{ marginTop: "10px" }}>
          {cat.name}

          <button
            onClick={() => deleteCategory(cat.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}

      <hr style={{ margin: "25px 0" }} />

      <h2>🍔 Add Menu Item</h2>

      <input
        placeholder="Dish Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={addItem}
        style={{ marginLeft: "10px" }}
      >
        Add Dish
      </button>

      <h2 style={{ marginTop: "25px" }}>
        📋 Menu Items
      </h2>

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
          <strong>{item.name}</strong>
          {" - "}₹{item.price}
          {" | "}
          {item.category}

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