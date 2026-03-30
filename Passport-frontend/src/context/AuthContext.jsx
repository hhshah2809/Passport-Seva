import { createContext, useState } from "react";
import API, { setAccessToken } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    setAccessToken(res.data.accessToken);
    setUser({ email });
  };

  const register = async (data) => {
    await API.post("/auth/register", data);
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
