import { useEffect, useState } from "react";
import { Card, Typography, Grid, IconButton, Box, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { categoryIcons } from "./CategoryIcons";
import API from "../api/api";

export default function TransactionList({ userId, refresh }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch both expenses and investments, and merge with type
    Promise.all([
      API.get(`/expenses?userId=${userId}`).then(res => res.data.map(e => ({ ...e, type: "Expense" }))),
      API.get(`/investments?userId=${userId}`).then(res => res.data.map(i => ({ ...i, type: "Investment" }))),
      // Optionally, add income endpoint if you have one
    ]).then(([expenses, investments]) => {
      setTransactions([...expenses, ...investments].sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
  }, [userId, refresh]);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" mb={1}>Recent Transactions</Typography>
      <Grid container spacing={2}>
        <AnimatePresence>
          {transactions.map(txn => {
            const Icon = categoryIcons[txn.category] || categoryIcons.Other;
            return (
              <Grid item xs={12} key={txn.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: 2 }}>
                    <Icon sx={{ fontSize: 32, color: "primary.main" }} />
                    <Box flex={1}>
                      <Typography fontWeight={600}>{txn.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Chip label={txn.category} size="small" sx={{ mr: 1 }} />
                        {new Date(txn.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color={txn.type === "Expense" ? "error" : "success.main"} sx={{ mr: 2 }}>
                      {txn.type === "Expense" ? "-" : "+"}₹{txn.amount.toLocaleString("en-IN")}
                    </Typography>
                    <IconButton onClick={async () => {
                      const endpoint = txn.type === "Investment" ? "investments" : "expenses";
                      await API.delete(`/${endpoint}/${txn.id}`);
                      setTransactions(transactions.filter(t => t.id !== txn.id));
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </AnimatePresence>
      </Grid>
    </Box>
  );
}