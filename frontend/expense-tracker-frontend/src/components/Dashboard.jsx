import { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Avatar } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import API from "../api/api";

const COLORS = ["#1976d2", "#d32f2f", "#388e3c", "#ff9800", "#9c27b0", "#009688"];

export default function Dashboard({ userId, transactions = [] }) {
  const [data, setData] = useState({
    availableBalance: 0,
    totalExpenses: 0,
    totalIncome: 0,
    investments: 0
  });

  useEffect(() => {
    API.get(`/dashboard?userId=${userId}`).then(res => setData(res.data || {}));
  }, [userId, transactions]);

  // Pie chart data
  const categoryData = [];
  transactions
    .filter(t => t.type === "Expense")
    .forEach(t => {
      const found = categoryData.find(c => c.name === t.category);
      if (found) found.value += t.amount;
      else categoryData.push({ name: t.category, value: t.amount });
    });

  // Helper to safely format numbers
  const formatINR = (n) =>
    (typeof n === "number" ? n : 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <Card sx={{ p: 3, background: "#1976d2", color: "#fff", textAlign: "center" }}>
            <Avatar sx={{ bgcolor: "#fff", color: "#1976d2", mx: "auto", mb: 1 }}>
              <AccountBalanceWalletIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={700}>Available Balance</Typography>
            <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>
              {formatINR(data.availableBalance)}
            </Typography>
          </Card>
        </motion.div>
      </Grid>
      <Grid>
        <Card sx={{ p: 2, background: "#e3f2fd", color: "#1976d2" }}>
          <TrendingDownIcon /> <b>Expenses</b>
          <Typography variant="h6" color="error">
            {formatINR(data.totalExpenses)}
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ p: 2, background: "#e8f5e9", color: "#388e3c" }}>
          <TrendingUpIcon /> <b>Income</b>
          <Typography variant="h6" color="success.main">
            {formatINR(data.totalIncome)}
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Spending by Category</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </Grid>
  );
}