import { useState } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import API from "../../api/api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId || "1"); // fallback if userId not returned
      onLogin();
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <Card sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" name="username" value={form.username} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth>Login</Button>
        </form>
      </Card>
    </motion.div>
  );
}