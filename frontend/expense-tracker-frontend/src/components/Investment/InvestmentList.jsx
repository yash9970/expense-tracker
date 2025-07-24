import { useEffect, useState } from "react";
import { Card, List, ListItem, ListItemText, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/api";

export default function InvestmentList({ userId, refresh }) {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    API.get(`/investments?userId=${userId}`).then(res => setInvestments(res.data));
  }, [userId, refresh]);

  const handleDelete = async (id) => {
    await API.delete(`/investments/${id}`);
    setInvestments(investments.filter(i => i.id !== id));
  };

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" mb={1}>Investments</Typography>
      <List>
        <AnimatePresence>
          {investments.map(inv => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(inv.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
               <ListItemText
                    primary={inv.name}
                    secondary={`${Number(inv.amount).toLocaleString("en-IN", { style: "currency", currency: "INR" })} - ${inv.type} (${inv.date})`}
                />
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Card>
  );
}