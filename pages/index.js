import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  LinearProgress,
  InputAdornment,
  Checkbox,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const initialMeal = (id) => ({
  id,
  name: "",
  description: "",
  fat: "",
  carbs: "",
  protein: "",
  calories: "",
  eaten: false,
});

const dailyGoals = {
  calories: 2500,
  protein: 140,
};

export default function Home() {
  const [meals, setMeals] = useState([initialMeal(1)]);
  const [collapsed, setCollapsed] = useState({ 1: false });
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(dateString);
  }, []);

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id, field, value) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === id ? { ...meal, [field]: value } : meal,
      ),
    );
  };

  const handleCheckboxChange = (id) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === id ? { ...meal, eaten: !meal.eaten } : meal,
      ),
    );
  };

  const addMeal = () => {
    const nextId = meals.length + 1;
    setMeals((prevMeals) => [...prevMeals, initialMeal(nextId)]);
    setCollapsed((prev) => ({ ...prev, [nextId]: false }));
  };

  const deleteMeal = (id) => {
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
  };

  const totalCalories = meals.reduce(
    (sum, meal) => sum + (meal.eaten ? Number(meal.calories || 0) : 0),
    0,
  );

  const totalProtein = meals.reduce(
    (sum, meal) => sum + (meal.eaten ? Number(meal.protein || 0) : 0),
    0,
  );

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 70,
          lineHeight: 1,
        }}
      >
        Intentional Eating
      </Typography>
      <Typography variant="subtitle1">{currentDate}</Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="body1">
          Calories: {totalCalories} / {dailyGoals.calories}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(totalCalories / dailyGoals.calories) * 100}
          sx={{
            height: 10,
            borderRadius: 1,
            backgroundColor: "#ccc",
            "& .MuiLinearProgress-bar": { backgroundColor: "lightgreen" },
          }}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="body1">
          Protein: {totalProtein} / {dailyGoals.protein}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(totalProtein / dailyGoals.protein) * 100}
          sx={{
            height: 10,
            borderRadius: 1,
            backgroundColor: "#ccc",
            "& .MuiLinearProgress-bar": { backgroundColor: "orange" },
          }}
        />
      </Box>
      {meals.map((meal) => (
        <Paper key={meal.id} sx={{ my: 2, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              onClick={() => toggleCollapse(meal.id)}
              sx={{ cursor: "pointer" }}
            >
              Meal {meal.id}:
              <TextField
                variant="standard"
                value={meal.name}
                onChange={(e) =>
                  handleInputChange(meal.id, "name", e.target.value)
                }
                placeholder="Title"
                InputProps={{ disableUnderline: true }}
                sx={{ ml: 1 }}
              />
            </Typography>
            {collapsed[meal.id] && (
              <IconButton onClick={() => deleteMeal(meal.id)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          {!collapsed[meal.id] && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  my: 1,
                }}
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Typography>Description:</Typography>
                  <TextField
                    variant="outlined"
                    multiline
                    minRows={4}
                    value={meal.description}
                    onChange={(e) =>
                      handleInputChange(meal.id, "description", e.target.value)
                    }
                    placeholder="Description"
                    fullWidth
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  {["Fat", "Carbs", "Protein", "Calories"].map(
                    (macro, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          my: 1,
                        }}
                      >
                        <Typography>{macro}:</Typography>
                        <TextField
                          variant="outlined"
                          type="number"
                          value={meal[macro.toLowerCase()]}
                          onChange={(e) =>
                            handleInputChange(
                              meal.id,
                              macro.toLowerCase(),
                              e.target.value,
                            )
                          }
                          sx={{ ml: 1, width: 100 }}
                          InputProps={{
                            endAdornment: macro !== "Calories" && (
                              <InputAdornment position="end">g</InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    ),
                  )}
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography>Eaten:</Typography>
                <Checkbox
                  checked={meal.eaten}
                  onChange={() => handleCheckboxChange(meal.id)}
                  sx={{ ml: 1 }}
                />
              </Box>
            </>
          )}
        </Paper>
      ))}
      {meals.length < 10 && (
        <Button
          variant="contained"
          onClick={addMeal}
          sx={{
            backgroundColor: "#FAFAFA",
            color: "black",
            mt: 2,
            "&:hover": { backgroundColor: "#E0E0E0" },
          }}
        >
          +
        </Button>
      )}
    </Box>
  );
}
