import { useState } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import API from "../../api/api";

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <Card sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" mb={2}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" name="username" value={form.username} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth>Register</Button>
        </form>
      </Card>
    </motion.div>
  );
}