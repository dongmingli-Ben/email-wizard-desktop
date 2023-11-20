import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { backendConfig, post } from "../../utilities/requestUtility";
import { Alert } from "@mui/material";
import { Copyright } from "../modules/CopyWrite";

type LoginPageProps = {
  userId: number;
  userSecret: string;
  setUserId: (userId: number) => void;
  setUserSecret: (userSecret: string) => void;
};

const authenticateUserPassword = async (
  username: string,
  password: string
): Promise<{ userId: number; userSecret: string; errMsg: string }> => {
  return post(backendConfig.verify_user, {
    username: username,
    password: password,
  })
    .then((resp) => {
      return {
        userId: resp.user_id,
        userSecret: resp.user_secret,
        errMsg: "",
      };
    })
    .catch((e) => {
      console.log(`error in user verification: ${e}`);
      return {
        userId: -1,
        userSecret: "",
        errMsg: "Cannot verify your user name and password",
      };
    });
};

/**
 * Define the "CalendarPage" component as a function.
 */
const LoginPage = (props: LoginPageProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    let remember = data.get("remember") === null ? false : true;
    setLoading(true);
    setErrorMsg("");
    authenticateUserPassword(username as string, password as string).then(
      (resp: { userId: number; userSecret: string; errMsg: string }) => {
        console.log(resp);
        if (resp.userId > 0) {
          console.log("redirecting to /calendar");
          props.setUserId(resp.userId);
          props.setUserSecret(resp.userSecret);
          sessionStorage.setItem("userId", resp.userId.toString());
          sessionStorage.setItem("userSecret", resp.userSecret);
          if (remember) {
            localStorage.setItem("userId", resp.userId.toString());
            localStorage.setItem("userSecret", resp.userSecret);
          }
          navigate("/calendar");
        } else {
          setErrorMsg(resp.errMsg);
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
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          // noValidate
          sx={{ mt: 1 }}
        >
          {errorMsg === "" ? <></> : <Alert severity="error">{errorMsg}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="user name"
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
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="yes" color="primary" name="remember" />}
            label="Remember me"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link
                variant="body2"
                component="button"
                onClick={() => {
                  navigate("/reset");
                }}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                variant="body2"
                component="button"
                onClick={() => {
                  navigate("/register");
                }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default LoginPage;
