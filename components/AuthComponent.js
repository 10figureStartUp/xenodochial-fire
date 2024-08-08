import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Box, Button, Typography, TextField } from "@mui/material";
import { auth, db } from "../firebase";

const AuthComponent = ({ onUserChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onUserChange(user);
      } else {
        onUserChange(null);
      }
    });

    return () => unsubscribe();
  }, [onUserChange]);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        calorieGoal: 0,
        proteinGoal: 0,
      });
      alert("User created successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User signed in successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Macro Tracker
      </Typography>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        sx={{ mt: 2, mb: 1 }}
        fullWidth
      />
      <TextField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        sx={{ mb: 2 }}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleSignIn}
        sx={{
          mt: 2,
          mb: 1,
          backgroundColor: "black",
          color: "white",
        }}
        fullWidth
      >
        Sign In
      </Button>
      <Button
        variant="outlined"
        onClick={handleSignUp}
        sx={{
          mt: 1,
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
        }}
        fullWidth
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default AuthComponent;
