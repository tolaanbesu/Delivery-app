import { createContext, useReducer } from "react";
import {
  users,
  office,
  driver,
  categories,
  restaurants,
  menu
} from "../utils/data";

export const AppContext = createContext();

/* ======================================================
   INITIAL STATE
====================================================== */
const initialState = {
  // AUTH / USERS
  users,
  currentUser: null, // set on login
  activeRole: null, // "user" | "admin"

  // COMPANY / SUPPORT
  office,

  // DELIVERY
  driver,

  // DISCOVERY
  categories,
  restaurants,

  // MENU (admin-controlled)
  menu,

  // ORDERS
  orders: JSON.parse(localStorage.getItem("orders")) || [],
  activeOrders: JSON.parse(localStorage.getItem("activeOrders")) || []
};

/* ======================================================
   REDUCER
====================================================== */
function reducer(state, action) {
  switch (action.type) {
    /* =====================
       AUTH
    ===================== */
    case "LOGIN_USER": {
      return {
        ...state,
        currentUser: action.payload,
        activeRole: action.payload.role
      };
    }

    case "LOGOUT": {
      return {
        ...state,
        currentUser: null,
        activeRole: null
      };
    }

    /* =====================
       ORDERS
    ===================== */
    case "PLACE_ORDER": {
      const updatedOrders = [action.payload, ...state.orders];
      const updatedActive = [action.payload, ...state.activeOrders];

      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      localStorage.setItem("activeOrders", JSON.stringify(updatedActive));

      return {
        ...state,
        orders: updatedOrders,
        activeOrders: updatedActive
      };
    }

    case "UPDATE_ORDER_STATUS": {
      const orders = state.orders.map(order =>
        order.id === action.payload.id
          ? { ...order, status: action.payload.status }
          : order
      );

      const activeOrders = orders.filter(o => o.status === "active");

      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.setItem("activeOrders", JSON.stringify(activeOrders));

      return {
        ...state,
        orders,
        activeOrders
      };
    }

    /* =====================
       MENU (ADMIN)
    ===================== */
    case "UPDATE_MENU_ITEM": {
      return {
        ...state,
        menu: state.menu.map(category =>
          category.id === action.payload.catId
            ? {
                ...category,
                items: category.items.map(item =>
                  item.id === action.payload.item.id
                    ? action.payload.item
                    : item
                )
              }
            : category
        )
      };
    }

    /* =====================
       USER STATS (CHECKOUT)
    ===================== */
    case "UPDATE_USER_STATS": {
      const updatedUsers = state.users.map(u =>
        u.id === action.payload.id ? action.payload : u
      );

      return {
        ...state,
        users: updatedUsers,
        currentUser:
          state.currentUser?.id === action.payload.id
            ? action.payload
            : state.currentUser
      };
    }

    default:
      return state;
  }
}

/* ======================================================
   PROVIDER
====================================================== */
export const AppProvider = ({ children }) => {
  const store = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
};
