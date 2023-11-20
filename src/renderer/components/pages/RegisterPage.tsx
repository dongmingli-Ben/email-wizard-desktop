import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendConfig, post } from "../../utilities/requestUtility";

import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";
import { Copyright } from "../modules/CopyWrite";

const registerUserPassword = async (
  username: string,
  password: string
): Promise<{ errMsg: string }> => {
  return post(backendConfig.add_user, {
    username: username,
    password: password,
  })
    .then((resp) => {
      return { errMsg: "" };
    })
    .catch((e) => {
      console.log("fail to add new user:", e);
      return {
        errMsg: "Fail to add: Please change your user name.",
      };
    });
};

/**
 * Define the "CalendarPage" component as a function.
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data);
    let username = data.get("username");
    if (username === null) {
      setErrorMsg("User name is not entered.");
      return;
    }
    let password = data.get("password");
    if (password === null) {
      setErrorMsg("Password is not entered.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    registerUserPassword(username as string, password as string).then(
      (resp: { errMsg: string }) => {
        console.log(resp);
        if (resp.errMsg.length > 0) {
          setErrorMsg(resp.errMsg);
        } else {
          setRegisterSuccess(true);
        }
        setLoading(false);
      }
    );
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          {errorMsg === "" ? <></> : <Alert severity="error">{errorMsg}</Alert>}
          {registerSuccess ? (
            <Alert severity="success">
              You have successfully registered a new account! Now{" "}
              <Link
                variant="body2"
                component="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign in
              </Link>
              !
            </Alert>
          ) : (
            <></>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="user-name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                variant="body2"
                component="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default RegisterPage;
