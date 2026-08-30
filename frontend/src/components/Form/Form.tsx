import { useState } from "react";
import api from "../../api/axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import { useNavigate } from "react-router";

type FormProps = {
  type: "login" | "register";
  route: string;
};

export function Form({ type, route }: FormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (type === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{type === "login" ? "Login" : "Register"}</h1>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="email">Password</label>
      <input
        id="email"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">{type === "login" ? "Login" : "Register"}</button>
    </form>
  );
}
