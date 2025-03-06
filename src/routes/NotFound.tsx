import React from "react";
import Typography from "@mui/material/Typography";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
      data-testid="NotFound"
    >
      <Typography variant="h3" component="h1">
        404
      </Typography>
      <Typography variant="h3" component="h1">
        Not Found !
      </Typography>
    </div>
  );
}

export default NotFound;
