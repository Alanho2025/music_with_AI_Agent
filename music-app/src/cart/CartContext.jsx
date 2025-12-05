// src/cart/CartContext.jsx
import React, {
    createContext,
    useContext,
    useMemo,
    useReducer,
    useEffect,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "kpophub_cart_v1";

function loadInitialCart() {
    if (typeof window === "undefined") return { items: [] };

    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return { items: [] };

        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.items)) return { items: [] };

        return {
            items: parsed.items.map((i) => ({
                ...i,
                quantity: Number(i.quantity) || 1,
                price_nzd:
                    i.price_nzd !== null && i.price_nzd !== undefined
                        ? Number(i.price_nzd)
                        : 0,
                stock:
                    i.stock !== null && i.stock !== undefined
                        ? Number(i.stock)
                        : null,
            })),
        };
    } catch (err) {
        console.warn("Failed to load cart from localStorage", err);
        return { items: [] };
    }
}

function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const { album, quantity } = action.payload;
            const existing = state.items.find((i) => i.id === album.id);

            if (existing) {
                const maxStock =
                    album.stock ?? existing.stock ?? Number.MAX_SAFE_INTEGER;
                const newQty = Math.min(existing.quantity + quantity, maxStock);

                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === album.id ? { ...i, quantity: newQty } : i
                    ),
                };
            }

            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        id: album.id,
                        title: album.title,
                        group_name: album.group_name,
                        price_nzd: album.price_nzd ?? 0,
                        img_url: album.img_url,
                        stock: album.stock ?? null,
                        quantity,
                    },
                ],
            };
        }

        case "SET_QTY": {
            const { id, quantity } = action.payload;
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                ),
            };
        }

        case "REMOVE_ITEM": {
            const { id } = action.payload;
            return {
                ...state,
                items: state.items.filter((item) => item.id !== id),
            };
        }

        case "CLEAR": {
            return { ...state, items: [] };
        }

        default:
            return state;
    }
}

export function CartProvider({ children }) {
    // ✅ 用 lazy init，第一次就從 localStorage 載入
    const [state, dispatch] = useReducer(
        cartReducer,
        undefined,
        loadInitialCart
    );

    // ✅ 每次 items 變化就寫回 localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify({ items: state.items })
            );
        } catch (err) {
            console.warn("Failed to save cart to localStorage", err);
        }
    }, [state.items]);

    const value = useMemo(
        () => ({
            items: state.items,
            totalItems: state.items.reduce(
                (sum, item) => sum + item.quantity,
                0
            ),
            totalPrice: state.items.reduce(
                (sum, item) => sum + item.quantity * (item.price_nzd ?? 0),
                0
            ),
            addToCart: (album, quantity = 1) => {
                if (!album || !album.id) return;
                dispatch({ type: "ADD_ITEM", payload: { album, quantity } });
            },
            updateQuantity: (id, quantity) => {
                dispatch({ type: "SET_QTY", payload: { id, quantity } });
            },
            removeItem: (id) => {
                dispatch({ type: "REMOVE_ITEM", payload: { id } });
            },
            clearCart: () => {
                dispatch({ type: "CLEAR" });
            },
        }),
        [state.items]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
