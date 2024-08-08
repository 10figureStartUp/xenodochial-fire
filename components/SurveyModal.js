import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Modal } from "@mui/material";

const SurveyModal = ({ open, onClose, onSaveGoals }) => {
  const [step, setStep] = useState(1);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setCalories("");
      setProtein("");
    }
  }, [open]);

  const handleSave = () => {
    onSaveGoals(calories, protein);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {step === 1 ? (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Welcome to Macro Tracker!
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Please click the link below to find out your ideal macro goals:
            </Typography>
            <Typography sx={{ mb: 4 }}>
              <a
                href="https://www.calculator.net/macro-calculator.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Macro Calculator
              </a>
            </Typography>
            <Button
              onClick={() => setStep(2)}
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
              Continue
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Set Your Daily Goals
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
              Save
            </Button>
          </>
        )}
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

export default SurveyModal;
