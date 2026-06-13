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
const [imageUrl, setImageUrl] = useState("");
const [inStock, setInStock] = useState(true);
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
  imageUrl,
  inStock,
});
  

    setName("");
    setPrice("");
    setImageUrl("");
setInStock(true);
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "menu", id));
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
    color: "#f97316",
    fontSize: "42px",
    marginBottom: "30px"
  }}
>
  👨‍💼 Admin Dashboard
</h1>


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
      <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    marginBottom: "20px"
  }}
>

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

<input
  placeholder="Image URL"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
  style={{ marginLeft: "10px" }}
/>

<label style={{ marginLeft: "10px" }}>
  <input
    type="checkbox"
    checked={inStock}
    onChange={(e) => setInStock(e.target.checked)}
  />
  In Stock
</label>


      <button
        onClick={addItem}
        style={{ marginLeft: "10px" }}
      >
        Add Dish
      </button>
</div>
      <h2 style={{ marginTop: "25px" }}>
        📋 Menu Items
      </h2>

      {menu.map((item) => (
        <div
          key={item.id}
          style={{
  background: "white",
  padding: "15px",
  marginBottom: "12px",
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
}}
        >{item.imageUrl && (
  <img
    src={item.imageUrl}
    alt={item.name}
    style={{
      width: "80px",
      height: "80px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "10px"
    }}
  />
)}
          <strong>{item.name}</strong>
{" - "}₹{item.price}
{" | "}
{item.category}

<br />

{item.inStock !== false
  ? "✅ Available"
  : "❌ Out of Stock"}


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