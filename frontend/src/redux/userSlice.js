import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopsInMyCity: [],
    itemsInMyCity: [],
    cartItems: [
      // {
      //   //data arrange  in cartItems for frontend side render , created my way for what to show in frontend
      //   id: null,
      //   name: null,
      //   price: null,
      //   image: null,
      //   shop: null,
      //   quantity: null,
      //   foodType: null,
      // },
    ],
    totalAmount: 0,
    myOrders: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setcurrentState: (state, actiom) => {
      state.currentState = actiom.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    // 🔹 addToCart reducer
    // This function runs when we dispatch addToCart action from frontend.
    // action.payload contains the item user wants to add to cart.

    addToCart: (state, action) => {
      const cartItem = action.payload;
      // cartItem = new item coming from UI (id, name, price, quantity etc.)

      // Check if this item already exists in cart
      const existingItem = state.cartItems.find((i) => i.id == cartItem.id);

      if (existingItem) {
        // If item already in cart:
        // 👉 we should increase quantity of that item

        existingItem.quantity += cartItem.quantity;
      } else {
        // If item not in cart:
        // 👉 we should push new item into cartItems array
        // BUT currently this is wrong:
        state.cartItems.push(cartItem);

        // Correct version should be:
        // state.cartItems.push(cartItem);
      }

      // ------------------total amount section start here

      // Recalculate the total price of all items in the cart

      // state.cartItems is an array like:
      // [
      //   { id: 1, price: 100, quantity: 2 },
      //   { id: 2, price: 50, quantity: 3 }
      // ]

      // .reduce() loops through the array and builds a single final value (the total amount)
      // Syntax: reduce((accumulator, currentItem) => newValue, initialValue)

      // Here:
      // sum → running total (accumulator)
      // i   → current cart item
      // initial value → 0 (start total from 0)

      state.totalAmount = state.cartItems.reduce((sum, i) => {
        // For each item:
        // multiply price × quantity to get that item's subtotal
        const itemTotal = i.price * i.quantity;

        // Add subtotal to running total
        return sum + itemTotal;
      }, 0);

      // After loop finishes:
      // state.totalAmount contains the grand total of the cart

      // Example:
      // cartItems = [
      //   { price: 100, quantity: 2 }, → 200
      //   { price: 50, quantity: 3 }   → 150
      // ]
      // Final totalAmount = 350

      // Redux Toolkit allows this assignment directly
      // because Immer handles immutable state updates internally.
    },
    updateQuantity: (state, action) => {
      // 1️⃣ Redux Toolkit calls this reducer when
      // dispatch(updateQuantity({ id, quantity })) runs from frontend.

      // action object looks like:
      // {
      //   type: "cart/updateQuantity",
      //   payload: { id: 5, quantity: 3 }
      // }

      // 2️⃣ Extract values sent from frontend
      // id → which cart item to update
      // quantity → new quantity to set
      const { id, quantity } = action.payload;

      // 3️⃣ Find the item inside Redux state
      // state.cartItems is an array like:
      // [
      //   { id: 1, name: "Burger", quantity: 2 },
      //   { id: 5, name: "Pizza", quantity: 1 }
      // ]
      // .find() returns the first matching item
      const items = state.cartItems.find((i) => i.id === id);

      // 4️⃣ If item exists in cart
      if (items) {
        // 5️⃣ Update its quantity
        // Redux Toolkit uses Immer internally,
        // so direct mutation is allowed.
        // This line *looks* like mutation but
        // Immer converts it into immutable update.
        items.quantity = quantity;
      }

      // 6️⃣ If item not found → nothing happens
      // (safe guard to prevent crash)

      // ******************************* TOTAL-AMOUNT PART
      state.totalAmount = state.cartItems.reduce((sum, i) => {
        // For each item:
        // multiply price × quantity to get that item's subtotal
        const itemTotal = i.price * i.quantity;

        // Add subtotal to running total
        return sum + itemTotal;
      }, 0);
    },

    removeCartItem: (state, action) => {
      // 1️⃣ This reducer runs when frontend dispatches from frontend UI
      // dispatch(removeCartItem(id))
      //
      // Example action object received:
      // {
      //   type: "cart/removeCartItem",
      //   payload: 5   // id of item to remove
      // }

      // 2️⃣ state.cartItems is the current cart array:
      // [
      //   { id: 1, name: "Burger", quantity: 2 },
      //   { id: 5, name: "Pizza", quantity: 1 },
      //   { id: 9, name: "Fries", quantity: 3 }
      // ]

      // 3️⃣ .filter() creates a NEW array
      // It keeps only items whose id is NOT equal to action.payload
      //
      // If payload = 5 → remove item with id 5
      // Condition: i.id !== action.payload
      // Meaning: keep everything except the matching id

      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);

      // 4️⃣ After filter runs:
      // Item with matching id is removed from cart

      // 5️⃣ Redux Toolkit uses Immer internally,
      // so this "mutation-looking" code is safe.
      // It actually produces a new immutable state.

      // 6️⃣ React automatically re-renders UI
      // because Redux state changed.

      state.totalAmount = state.cartItems.reduce((sum, i) => {
        // For each item:
        // multiply price × quantity to get that item's subtotal
        const itemTotal = i.price * i.quantity;

        // Add subtotal to running total
        return sum + itemTotal;
      }, 0);
    },

    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },

    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;

      const order = state.myOrders.find((o) => o._id === orderId);

      if (order) {
        const shopOrder = order.shopOrders.find((s) => {
          const shopValue = s.shop?._id || s.shop;
          return shopValue.toString() === shopId;
        });

        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },
  },
});

export const {
  setUserData,
  setCurrentAddress,
  setcurrentState,
  setCurrentCity,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeCartItem,
  setMyOrders,
  updateOrderStatus,
} = userSlice.actions;

export default userSlice.reducer;
