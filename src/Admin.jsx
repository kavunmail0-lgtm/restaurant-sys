import { useState } from "react";

function Admin() {
  const [menu, setMenu] = useState([
    { name: "Burger", price: 120 },
    { name: "Pizza", price: 250 },
    { name: "Coke", price: 40 }
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addItem = () => {
    if (!name || !price) return;

    setMenu([
      ...menu,
      {
        name,
        price: Number(price)
      }
    ]);

    setName("");
    setPrice("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <input
        placeholder="Dish Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={addItem}>
        Add Dish
      </button>

      <h2>Menu</h2>

      {menu.map((item, index) => (
        <div key={index}>
          {item.name} - ₹{item.price}
        </div>
      ))}
    </div>
  );
}

export default Admin;