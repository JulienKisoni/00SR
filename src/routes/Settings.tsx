import React, { useState, useCallback } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { UsersSrv } from "../services/controllers/UserSrv";
import { ROUTES } from "../constants/routes";

const Settings = () => {
  const [state, setState] = useState({ tabIndex: 0 });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setState((prev) => ({ ...prev, tabIndex: newValue }));
    },
    []
  );
  const handleLogout = useCallback(() => {
    const usersSrv = new UsersSrv(dispatch);
    usersSrv.logout();
    navigate(`/${ROUTES.SIGNIN}`);
  }, [dispatch, navigate]);

  return (
    <Container>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={state.tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Actions" value={0} />
              <Tab label="Profile" value={1} />
              <Tab label="Password" value={2} />
            </TabList>
          </Box>
          <TabPanel value={0}>
            <Stack direction="row">
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
              <Button variant="contained">Delete account</Button>
            </Stack>
          </TabPanel>
          <TabPanel value={1}>Item Two</TabPanel>
          <TabPanel value={2}>Item Three</TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Settings;
