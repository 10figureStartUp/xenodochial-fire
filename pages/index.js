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
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import AuthComponent from "../components/AuthComponent";

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

const getCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mounted, setMounted] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    setMounted(true);
    const dateString = getCurrentDate();
    setCurrentDate(dateString);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMeals(currentUser.uid, dateString);
      } else {
        setUser(null);
        setMeals([]);
      }
    });
  }, []);

  const fetchMeals = async (uid, date) => {
    const docRef = doc(db, "meals", `${uid}_${date}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMeals(docSnap.data().meals);
      setCollapsed(
        docSnap.data().meals.reduce((acc, meal) => {
          acc[meal.id] = true;
          return acc;
        }, {}),
      );
    } else {
      setMeals([initialMeal(1)]);
      setCollapsed({ 1: false });
    }
  };

  const saveMeals = async (updatedMeals) => {
    if (user) {
      await setDoc(doc(db, "meals", `${user.uid}_${currentDate}`), {
        meals: updatedMeals,
      });
    }
  };

  const handleSave = () => {
    saveMeals(meals);
  };

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id, field, value) => {
    const updatedMeals = meals.map((meal) =>
      meal.id === id ? { ...meal, [field]: value } : meal,
    );
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  const handleCheckboxChange = (id) => {
    const updatedMeals = meals.map((meal) =>
      meal.id === id ? { ...meal, eaten: !meal.eaten } : meal,
    );
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  const addMeal = () => {
    const nextId = meals.length + 1;
    const updatedMeals = [...meals, initialMeal(nextId)];
    setMeals(updatedMeals);
    setCollapsed((prev) => ({ ...prev, [nextId]: false }));
    saveMeals(updatedMeals);
  };

  const deleteMeal = (id) => {
    const updatedMeals = meals.filter((meal) => meal.id !== id);
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  const totalCalories = meals.reduce(
    (sum, meal) => sum + (meal.eaten ? Number(meal.calories || 0) : 0),
    0,
  );

  const totalProtein = meals.reduce(
    (sum, meal) => sum + (meal.eaten ? Number(meal.protein || 0) : 0),
    0,
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("Signed out successfully");
      handleMenuClose();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 2,
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {user ? (
        <>
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
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <Avatar />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
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
                          handleInputChange(
                            meal.id,
                            "description",
                            e.target.value,
                          )
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
                                  <InputAdornment position="end">
                                    g
                                  </InputAdornment>
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
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#FAFAFA",
              color: "black",
              position: "fixed",
              bottom: 16,
              right: 16,
              "&:hover": { backgroundColor: "#E0E0E0" },
            }}
          >
            Save
          </Button>
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
        </>
      ) : (
        <AuthComponent onUserChange={setUser} />
      )}
    </Box>
  );
}
