// components/SurveyModal.js
import { useState } from "react";
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

const SurveyModal = ({ open, onClose, onSaveGoals }) => {
  const [step, setStep] = useState(1);
  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");

  const handleNext = () => setStep(2);

  const handleSave = () => {
    onSaveGoals(calorieGoal, proteinGoal);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown>
      <DialogTitle>
        {step === 1 ? "Welcome to Macro Tracker!" : "Set Your Goals"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {step === 1 && (
          <>
            <Typography>
              Please click the link below to find out your ideal macro goals:
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                window.open(
                  "https://www.calculator.net/macro-calculator.html",
                  "_blank",
                )
              }
              sx={{ mt: 2 }}
            >
              Go to Macro Calculator
            </Button>
          </>
        )}
        {step === 2 && (
          <>
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
          </>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 ? (
          <Button onClick={handleNext}>Continue</Button>
        ) : (
          <Button onClick={handleSave}>Save Goals</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SurveyModal;
