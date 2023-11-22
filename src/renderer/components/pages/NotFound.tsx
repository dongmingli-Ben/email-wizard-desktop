import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h1">404</Typography>
        <Typography variant="h6" sx={{ m: 2 }}>
          The page you’re looking for doesn’t exist.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/");
          }}
        >
          Back Home
        </Button>
      </Box>
    </Container>
  );
}
