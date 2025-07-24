import { useState } from "react";
import { TextField, Button, Card, MenuItem, Box, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { categoryIcons } from "./CategoryIcons";
import API from "../api/api";

const categories = [
  "Groceries", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Rent", "Mobile", "Salary", "Other"
];

export default function AddTransaction({ userId, onAdd }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "", type: "Expense" });
  const [snack, setSnack] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleType = (_, newType) => {
    if (newType) setForm({ ...form, type: newType });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const endpoint = form.type === "Investment" ? "investments" : "expenses";
    await API.post(`/${endpoint}?userId=${userId}`, { ...form, amount: parseFloat(form.amount), date: new Date() });
    setForm({ title: "", amount: "", category: "", type: "Expense" });
    setSnack(true);
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
          <ToggleButtonGroup
            value={form.type}
            exclusive
            onChange={handleType}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="Expense" color="error">Expense</ToggleButton>
            <ToggleButton value="Income" color="success">Income</ToggleButton>
            <ToggleButton value="Investment" color="primary">Investment</ToggleButton>
          </ToggleButtonGroup>
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
          <Button type="submit" variant="contained" fullWidth>Add {form.type}</Button>
        </form>
      </Card>
      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>{form.type} added!</Alert>
      </Snackbar>
    </motion.div>
  );
}