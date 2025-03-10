import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  selectedItems: [],
  currentOrder: {
    quantity: 0,
    _id: null,
    detail: null,
  },
  checkoutProducts: [],
  totalPrice: 0,
  shippingFee: 23688,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { quantity, _id, detail } = action.payload;
      const maxQuantity = detail?.quantity || 0;
      const existingProductIndex = state.cart.findIndex(
        (item) => item._id === _id
      );

      if (existingProductIndex >= 0) {
        // Calculate new total quantity
        const newTotalQuantity =
          state.cart[existingProductIndex].quantity + quantity;
        // Set quantity to maxQuantity if it would exceed the limit
        state.cart[existingProductIndex].quantity = Math.min(
          newTotalQuantity,
          maxQuantity
        );
      } else {
        // For new items, ensure quantity doesn't exceed maxQuantity
        state.cart.push({
          quantity: Math.min(quantity, maxQuantity),
          _id,
          detail,
        });
      }
    },

    updateCartQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const productIndex = state.cart.findIndex((item) => item._id === _id);

      if (productIndex >= 0) {
        state.cart[productIndex].quantity = quantity;
      }
    },

    removeFromCart: (state, action) => {
      const _id = action.payload;
      state.cart = state.cart.filter((item) => item._id !== _id);
    },

    buyNow: (state, action) => {
      const { quantity, _id, detail } = action.payload;
      state.currentOrder = {
        quantity,
        _id,
        detail,
      };
    },

    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },

    setCheckoutProducts: (state, action) => {
      state.checkoutProducts = action.payload;
    },

    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },

    // Update cart quantities after successful checkout order
    updateCartQuantities: (state, action) => {
      const checkoutProducts = action.payload;
      state.cart = state.cart
        .map((cartItem) => {
          const checkoutProduct = checkoutProducts.find(
            (p) => p.id === cartItem._id
          );
          if (checkoutProduct) {
            return {
              ...cartItem,
              detail: {
                ...cartItem.detail,
                quantity:
                  cartItem.detail.quantity - checkoutProduct.quantityValue,
              },
            };
          }
          return cartItem;
        })
        .filter((item) => item.detail.quantity > 0); // Remove items with 0 quantity
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  buyNow,
  setSelectedItems,
  setCheckoutProducts,
  setTotalPrice,
  updateCartQuantities,
} = orderSlice.actions;

export default orderSlice.reducer;
