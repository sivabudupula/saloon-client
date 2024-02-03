import React, { useState } from 'react';

const Inventory = () => {
  const sampleInventory = [
    { id: 1, name: "Item 1", price: 10, quantity: 50 },
    { id: 2, name: "Item 2", price: 20, quantity: 30 },
    { id: 3, name: "Item 3", price: 15, quantity: 40 },
  ];

  const [inventory, setInventory] = useState(sampleInventory);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    updateTotal(updatedCart);

    // Update the inventory by decreasing the quantity
    const updatedInventory = inventory.map((inventoryItem) => {
      if (inventoryItem.id === item.id) {
        return { ...inventoryItem, quantity: inventoryItem.quantity - 1 };
      }
      return inventoryItem;
    });

    setInventory(updatedInventory);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    updateTotal(updatedCart);

    // Find the item to be removed from the cart
    const removedItem = cart.find((item) => item.id === itemId);

    if (removedItem) {
      // Update the inventory by increasing the quantity
      const updatedInventory = inventory.map((inventoryItem) => {
        if (inventoryItem.id === itemId) {
          return { ...inventoryItem, quantity: inventoryItem.quantity + 1 };
        }
        return inventoryItem;
      });

      setInventory(updatedInventory);
    }
  };

  const updateTotal = (cartItems) => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    setTotal(newTotal);
  };

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} - Quantity: {item.quantity}{' '}
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <h1>Billing</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}{' '}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>Total: ${total}</h2>
    </div>
  );
};

export default Inventory;