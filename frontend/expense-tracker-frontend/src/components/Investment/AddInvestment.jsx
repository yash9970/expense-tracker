import { useState } from "react";
import { TextField, Button, Card } from "@mui/material";
import { motion } from "framer-motion";
import API from "../../api/api";

export default function AddInvestment({ userId, onAdd }) {
  const [form, setForm] = useState({ name: "", amount: "", type: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post(`/investments?userId=${userId}`, { ...form, amount: parseFloat(form.amount), date: new Date() });
    setForm({ name: "", amount: "", type: "" });
    onAdd();
  };

  return (
    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Card sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Type" name="type" value={form.type} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" fullWidth>Add Investment</Button>
        </form>
      </Card>
    </motion.div>
  );
}