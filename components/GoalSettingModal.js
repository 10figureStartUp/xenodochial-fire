import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GoalSettingModal = ({
  open,
  onClose,
  onSaveGoals,
  currentCalories,
  currentProtein,
}) => {
  const [calories, setCalories] = useState(currentCalories);
  const [protein, setProtein] = useState(currentProtein);

  const handleSave = () => {
    onSaveGoals(calories, protein);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Update Your Daily Goals
        </Typography>
        <TextField
          label="Daily Calorie Goal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Daily Protein Goal"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          fullWidth
          sx={{ mb: 4 }}
        />
        <Button
          onClick={handleSave}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "darkgray" },
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Update & Save
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

export default GoalSettingModal;
