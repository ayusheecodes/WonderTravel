import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// BUG-11 fix: The previous store was memory-only — the entire cart was lost on
// any page refresh or when the 401 interceptor redirected the user to /login.
// Wrapping with Zustand's `persist` middleware serialises the cart to
// localStorage under the key 'wondertravel_cart' so it survives reloads.
const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      cartTotal: 0,

      addItem: (item) => set((state) => {
        // If an item of the same type already exists (e.g. only 1 flight
        // allowed per booking), replace it instead of appending.
        const existingIndex = state.cartItems.findIndex(i => i.type === item.type)
        let newItems

        if (existingIndex >= 0) {
          newItems = [...state.cartItems]
          newItems[existingIndex] = item
        } else {
          newItems = [...state.cartItems, item]
        }

        const newTotal = newItems.reduce((sum, current) => sum + current.price, 0)
        return { cartItems: newItems, cartTotal: newTotal }
      }),

      removeItem: (itemId) => set((state) => {
        const newItems = state.cartItems.filter(item => item.id !== itemId)
        const newTotal = newItems.reduce((sum, current) => sum + current.price, 0)
        return { cartItems: newItems, cartTotal: newTotal }
      }),

      clearCart: () => set({ cartItems: [], cartTotal: 0 }),
    }),
    {
      name: 'wondertravel_cart', // localStorage key
    }
  )
)

export default useCartStore
