import { useState } from "react";
import { TextField, Button, Card, MenuItem, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { categoryIcons } from "../../utils/categoryIcons";
import API from "../../api/api";

const categories = [
  "Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"
];

export default function AddExpense({ userId, onAdd }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post(`/expenses?userId=${userId}`, { ...form, amount: parseFloat(form.amount), date: new Date() });
    setForm({ title: "", amount: "", category: "" });
    onAdd();
  };

  const Icon = categoryIcons[form.category] || categoryIcons.Other;

  return (
    <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Card sx={{ p: 3, mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ mr: 2 }}>
          <Icon sx={{ fontSize: 40, color: "primary.main" }} />
        </Box>
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <Box display="flex" gap={2} mb={2}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />
            <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required fullWidth />
          </Box>
          <TextField
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          >
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <Button type="submit" variant="contained" fullWidth>Add Expense</Button>
        </form>
      </Card>
    </motion.div>
  );
}