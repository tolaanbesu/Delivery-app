import { createContext, useReducer, useEffect } from "react";
import { generateAdminDashboardData } from "./adminDashboardData";


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
  currentUser: null,
  activeRole: null,

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
  activeOrders: JSON.parse(localStorage.getItem("activeOrders")) || [],

  // DASHBOARD
  adminDashboardData: generateAdminDashboardData(
    users,
    JSON.parse(localStorage.getItem("orders")) || []
  )
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
      // FIX: Map through orders and update BOTH status and boardStatus
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.id
          ? { 
              ...order, 
              // update status (PAID/COMPLETED) AND boardStatus (New/Prep/Out/Done)
              status: action.payload.status || order.status,
              boardStatus: action.payload.boardStatus || order.boardStatus 
            }
          : order
      );

      // FIX: Active orders should include anything NOT completed
      const updatedActive = updatedOrders.filter(o => o.boardStatus !== "Done" && o.status !== "completed");

      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      localStorage.setItem("activeOrders", JSON.stringify(updatedActive));

      return {
        ...state,
        orders: updatedOrders,
        activeOrders: updatedActive
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
  const [state, dispatch] = useReducer(reducer, initialState);

  // We add a derived property for the Admin Dashboard so it's always fresh
  const enhancedState = {
    ...state,
    adminDashboardData: generateAdminDashboardData(state.users, state.orders)
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const email = localStorage.getItem("loggedInUserEmail");

    if (token && email) {
      const existingUser = state.users.find(u => u.email === email);
      if (existingUser) {
        dispatch({ type: "LOGIN_USER", payload: existingUser });
      }
    }
  }, []);

  return (
    <AppContext.Provider value={[enhancedState, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

