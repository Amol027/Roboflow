import React, { createContext, useContext, useReducer, useEffect } from "react";
import BASE_URL from "../utils/Config";
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  userPreferences: {
    theme: "light",
    notifications: true,
    language: "en",
  },
};

const USER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_PREFERENCES: "UPDATE_PREFERENCES",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case USER_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case USER_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case USER_ACTIONS.LOGOUT:
      return { ...initialState, loading: false };
    case USER_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    case USER_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload },
      };
    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: USER_ACTIONS.LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
  try {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    // ✅ use access_token, not token
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    dispatch({ type: USER_ACTIONS.LOGIN_SUCCESS, payload: data.user });

    return { success: true };
  } catch (error) {
    dispatch({ type: USER_ACTIONS.LOGIN_FAILURE, payload: error.message });
    return { success: false, error: error.message };
  }
};

const signup = async (userData) => {
  try {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Signup failed");
    }

    // ✅ use access_token, not token
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    dispatch({ type: USER_ACTIONS.LOGIN_SUCCESS, payload: data.user });

    return { success: true };
  } catch (error) {
    dispatch({ type: USER_ACTIONS.LOGIN_FAILURE, payload: error.message });
    return { success: false, error: error.message };
  }
};
  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch(`${BASE_URL}/auth/logout` , {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      dispatch({ type: USER_ACTIONS.LOGOUT });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: userData });
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        ...state.userPreferences,
        ...preferences,
      })
    );
  };

  const clearError = () => dispatch({ type: USER_ACTIONS.CLEAR_ERROR });

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateUser,
        updatePreferences,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export default UserContext;