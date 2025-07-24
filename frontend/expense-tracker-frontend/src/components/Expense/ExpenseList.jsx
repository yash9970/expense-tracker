import { useEffect, useState } from "react";
import { Card, Typography, Grid, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { categoryIcons } from "../../utils/categoryIcons";
import API from "../../api/api";

export default function ExpenseList({ userId, refresh }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    API.get(`/expenses?userId=${userId}`).then(res => setExpenses(res.data));
  }, [userId, refresh]);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" mb={1}>Recent Expenses</Typography>
      <Grid container spacing={2}>
        <AnimatePresence>
          {expenses.map(exp => {
            const Icon = categoryIcons[exp.category] || categoryIcons.Other;
            return (
              <Grid item xs={12} md={6} key={exp.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: 3 }}>
                    <Icon sx={{ fontSize: 32, color: "primary.main" }} />
                    <Box flex={1}>
                      <Typography fontWeight={600}>{exp.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.category} • {new Date(exp.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                   <Typography variant="h6" color="error" sx={{ mr: 2 }}>
                        -₹{exp.amount}
                    </Typography>
                    <IconButton onClick={async () => {
                      await API.delete(`/expenses/${exp.id}`);
                      setExpenses(expenses.filter(e => e.id !== exp.id));
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