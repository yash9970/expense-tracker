import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  Avatar,
  MenuItem,
  TextField,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";
import { expenseCategories, incomeCategories } from "./components/categoryData";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import API from "./api/api";

const formatINR = (n) =>
  (typeof n === "number" ? n : 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export default function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [showRegister, setShowRegister] = useState(false);
  const [tab, setTab] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  // Dashboard data
  const [dashboard, setDashboard] = useState({
    availableBalance: 0,
    totalExpenses: 0,
    totalIncome: 0,
  });

  // Transactions
  const [transactions, setTransactions] = useState([]);

  // Add Transaction Form
  const [form, setForm] = useState({
    type: "Expense",
    title: "",
    amount: "",
    category: "",
  });

  // Fetch dashboard and transactions
  useEffect(() => {
    if (!userId) return;
    API.get(`/dashboard?userId=${userId}`).then((res) =>
      setDashboard(res.data || {})
    );
    Promise.all([
      API.get(`/expenses?userId=${userId}`).then((res) =>
        res.data.map((e) => ({ ...e, type: "Expense" }))
      ),
      API.get(`/investments?userId=${userId}`).then((res) =>
        res.data.map((i) => ({ ...i, type: "Investment" }))
      ),
      API.get(`/income?userId=${userId}`).then((res) =>
        res.data.map((i) => ({ ...i, type: "Income" }))
      ),
    ]).then(([expenses, investments, incomes]) => {
      setTransactions(
        [...expenses, ...investments, ...incomes].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      );
    });
  }, [userId, refresh]);

  // Handle Add Transaction
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      setSnack({ open: true, msg: "Fill all fields", severity: "error" });
      return;
    }
    if (form.type === "Income" && Number(form.amount) < 0) {
      setSnack({
        open: true,
        msg: "Income cannot be negative",
        severity: "error",
      });
      return;
    }
    if (form.type === "Expense" && Number(form.amount) < 0) {
      setSnack({
        open: true,
        msg: "Expense cannot be negative",
        severity: "error",
      });
      return;
    }
    if (
      form.type === "Expense" &&
      Number(form.amount) > dashboard.availableBalance
    ) {
      setSnack({ open: true, msg: "Not enough balance", severity: "error" });
      return;
    }
    const endpoint =
      form.type === "Investment"
        ? "investments"
        : form.type === "Income"
        ? "income"
        : "expenses";
    await API.post(`/${endpoint}?userId=${userId}`, {
      ...form,
      amount: Math.abs(Number(form.amount)),
      date: new Date(),
    });
    setForm({ type: "Expense", title: "", amount: "", category: "" });
    setSnack({ open: true, msg: `${form.type} added!`, severity: "success" });
    setRefresh((r) => !r);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
  };

  // Category options
  const categories =
    form.type === "Expense" ? expenseCategories : incomeCategories;

  // Get icon for category
  const getIcon = (cat) => {
    const found = categories.find((c) => c.label === cat);
    return found ? (
      <found.icon sx={{ fontSize: 32, color: "primary.main" }} />
    ) : null;
  };

  // Login/Register UI
  if (!userId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ p: 4, minWidth: 320 }}>
          <Typography variant="h5" mb={2}>
            {showRegister ? "Register" : "Login"}
          </Typography>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const username = e.target.username.value;
              const password = e.target.password.value;
              if (showRegister) {
                // Register user
                try {
                  await API.post("/auth/register", { username, password });
                  setShowRegister(false);
                  alert("Registered! Now login.");
                } catch (err) {
                  alert(
                    "Registration failed: " +
                      (err.response?.data?.detail || err.message)
                  );
                }
              } else {
                // Login user
                try {
                  const res = await API.post("/auth/login", {
                    username,
                    password,
                  });
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("userId", res.data.userId);
                  setUserId(res.data.userId);
                } catch (err) {
                  alert(
                    "Login failed: " +
                      (err.response?.data?.detail || err.message)
                  );
                }
              }
            }}
          >
            <TextField
              name="username"
              label="Username"
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              {showRegister ? "Register" : "Login"}
            </Button>
          </form>
          <Button
            onClick={() => setShowRegister((v) => !v)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {showRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Expense Tracker (project by MIT Student)
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minHeight: 0,
        }}
      >
        {/* Dashboard Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Card
                sx={{
                  p: 3,
                  background: "#1976d2",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{ bgcolor: "#fff", color: "#1976d2", mx: "auto", mb: 1 }}
                >
                  <AccountBalanceWalletIcon />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  Available Balance
                </Typography>
                <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>
                  {formatINR(dashboard.availableBalance)}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          <Grid>
            <Card sx={{ p: 2, background: "#e3f2fd", color: "#1976d2" }}>
              <TrendingDownIcon /> <b>Expenses</b>
              <Typography variant="h6" color="error">
                {formatINR(dashboard.totalExpenses)}
              </Typography>
            </Card>
          </Grid>
          <Grid>
            <Card sx={{ p: 2, background: "#e8f5e9", color: "#388e3c" }}>
              <TrendingUpIcon /> <b>Income</b>
              <Typography variant="h6" color="success.main">
                {formatINR(dashboard.totalIncome)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for Add Transaction and Transactions */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Add Transaction" />
          <Tab label="Recent Transactions" />
        </Tabs>

        {/* Add Transaction Form */}
        {tab === 0 && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Card sx={{ p: 3, mb: 2 }}>
              <form onSubmit={handleAdd}>
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    select
                    label="Type"
                    name="type"
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        type: e.target.value,
                        category: "",
                      }))
                    }
                    required
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Expense">Expense</MenuItem>
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Investment">Investment</MenuItem>
                  </TextField>
                  <TextField
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                    fullWidth
                  />
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    required
                    sx={{ minWidth: 120 }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    required
                    fullWidth
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.label} value={cat.label}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <cat.icon sx={{ fontSize: 20 }} /> {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                  {getIcon(form.category)}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ minWidth: 160 }}
                  >
                    Add {form.type}
                  </Button>
                </Box>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Recent Transactions */}
        {tab === 1 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" mb={1}>
              Recent Transactions
            </Typography>
            <Grid container spacing={2}>
              <AnimatePresence>
                {transactions.map((txn) => {
                  const icon =
                    txn.type === "Expense"
                      ? expenseCategories.find((c) => c.label === txn.category)
                          ?.icon
                      : incomeCategories.find((c) => c.label === txn.category)
                          ?.icon;
                  const IconComp = icon || AccountBalanceWalletIcon;
                  return (
                    <Grid key={txn.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            boxShadow: 2,
                          }}
                        >
                          <IconComp
                            sx={{
                              fontSize: 32,
                              color:
                                txn.type === "Expense"
                                  ? "error.main"
                                  : "success.main",
                            }}
                          />
                          <Box flex={1}>
                            <Typography fontWeight={600}>
                              {txn.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {txn.category} •{" "}
                              {new Date(txn.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            color={
                              txn.type === "Expense" ? "error" : "success.main"
                            }
                            sx={{ mr: 2 }}
                          >
                            {txn.type === "Expense" ? "-" : "+"}
                            {formatINR(txn.amount)}
                          </Typography>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={2000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snack.severity} sx={{ width: "100%" }}>
            {snack.msg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}