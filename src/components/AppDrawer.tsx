import React, { memo, useCallback } from "react";
import type { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DomainIcon from "@mui/icons-material/Domain";
import { NavLink } from "react-router";

import { protectedRoutes, ROUTES } from "../constants/routes";

const drawerWidth = 72;

const AppDrawer = ({ children }: PropsWithChildren) => {
  const renderIcon = useCallback((route: ROUTES): React.JSX.Element => {
    switch (route) {
      case ROUTES.STORES:
        return <DomainIcon fontSize="large" />;
      default:
        return <InboxIcon fontSize="large" />;
    }
  }, []);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {protectedRoutes.map((route, index) => (
            <ListItem key={route.route} disablePadding>
              <NavLink to={`/${route.route}`}>
                <ListItemButton>
                  <ListItemIcon>{renderIcon(route.route)}</ListItemIcon>
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default memo(AppDrawer);
