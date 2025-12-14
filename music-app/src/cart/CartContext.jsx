// src/cart/CartContext.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from 'react';
import { useAuth } from '../auth/AuthContext';

const CartContext = createContext(null);

// 共用的清洗邏輯
function normalizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items.map((i) => ({
    ...i,
    quantity: Number(i.quantity) || 1,
    price_nzd:
      i.price_nzd !== null && i.price_nzd !== undefined
        ? Number(i.price_nzd)
        : 0,
    stock: i.stock !== null && i.stock !== undefined ? Number(i.stock) : null,
  }));
}

function loadCartFromStorage(key) {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return normalizeItems(parsed.items);
  } catch (err) {
    console.warn('Failed to load cart from localStorage', err);
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_ALL': {
      return {
        ...state,
        items: normalizeItems(action.payload),
      };
    }

    case 'ADD_ITEM': {
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

    case 'SET_QTY': {
      const { id, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
      };
    }

    case 'CLEAR': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  // 一開始先給一個空 state，後面用 effect 依照登入狀態載入
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { isAuthenticated, profile } = useAuth();

  // TODO: 這裡要換成你實際的 user id 欄位
  const userId = profile?.id; // 例如 profile.user_id / profile.sub 都可以

  // 🔁 根據登入狀態 / userId 載入對應的 cart
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isAuthenticated && userId) {
      const key = `kpophub_cart_user_${userId}_v1`;

      const items = loadCartFromStorage(key);
      dispatch({ type: 'SET_ALL', payload: items });
    } else {
      // 未登入 → 清空 cart（每次回到未登入狀態都從空開始）
      dispatch({ type: 'CLEAR' });
    }
  }, [isAuthenticated, userId]);

  // 💾 登入狀態下，items 每次變化就寫回該 user 的 cart
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated || !userId) return;

    const key = `kpophub_cart_user_${userId}_v1`;

    try {
      window.localStorage.setItem(key, JSON.stringify({ items: state.items }));
    } catch (err) {
      console.warn('Failed to save cart to localStorage', err);
    }
  }, [state.items, isAuthenticated, userId]);

  const value = useMemo(
    () => ({
      items: state.items,
      totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: state.items.reduce(
        (sum, item) => sum + item.quantity * (item.price_nzd ?? 0),
        0
      ),
      addToCart: (album, quantity = 1) => {
        if (!album || !album.id) return;
        dispatch({ type: 'ADD_ITEM', payload: { album, quantity } });
      },
      updateQuantity: (id, quantity) => {
        dispatch({ type: 'SET_QTY', payload: { id, quantity } });
      },
      removeItem: (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
      },
      clearCart: () => {
        dispatch({ type: 'CLEAR' });
      },
    }),
    [state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
