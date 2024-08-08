// components/GoalSettingModal.js
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
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
  const [calorieGoal, setCalorieGoal] = useState(currentCalories);
  const [proteinGoal, setProteinGoal] = useState(currentProtein);

  useEffect(() => {
    setCalorieGoal(currentCalories);
    setProteinGoal(currentProtein);
  }, [currentCalories, currentProtein]);

  const handleSave = () => {
    onSaveGoals(calorieGoal, proteinGoal);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Update Your Goals
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>Daily Calorie Goal</Typography>
        <TextField
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography>Daily Protein Goal</Typography>
        <TextField
          value={proteinGoal}
          onChange={(e) => setProteinGoal(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Update & Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalSettingModal;
