import { create } from 'zustand'

const useCartStore = create((set) => ({
  cartItems: [],
  cartTotal: 0,
  
  addItem: (item) => set((state) => {
    // If the item type already exists (e.g. only 1 flight allowed), replace it
    const existingIndex = state.cartItems.findIndex(i => i.type === item.type);
    let newItems;
    
    if (existingIndex >= 0) {
      newItems = [...state.cartItems];
      newItems[existingIndex] = item;
    } else {
      newItems = [...state.cartItems, item];
    }
    
    const newTotal = newItems.reduce((sum, current) => sum + current.price, 0);
    
    return { cartItems: newItems, cartTotal: newTotal };
  }),

  removeItem: (itemId) => set((state) => {
    const newItems = state.cartItems.filter(item => item.id !== itemId);
    const newTotal = newItems.reduce((sum, current) => sum + current.price, 0);
    return { cartItems: newItems, cartTotal: newTotal };
  }),

  clearCart: () => set({ cartItems: [], cartTotal: 0 }),
}))

export default useCartStore
