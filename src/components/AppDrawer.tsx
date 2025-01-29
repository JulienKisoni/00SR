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
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router";

import { protectedRoutes, ROUTES } from "../constants/routes";

const drawerWidth = 72;

const AppDrawer = ({ children }: PropsWithChildren) => {
  const renderIcon = useCallback((route: ROUTES): React.JSX.Element => {
    switch (route) {
      case ROUTES.STORES:
        return <DomainIcon sx={{ color: "white" }} fontSize="large" />;
      case ROUTES.PRODUCTS:
        return <StoreIcon sx={{ color: "white" }} fontSize="large" />;
      case ROUTES.CART:
        return <ShoppingCartIcon sx={{ color: "white" }} fontSize="large" />;
      case ROUTES.ORDERS:
        return <ReceiptIcon sx={{ color: "white" }} fontSize="large" />;
      case ROUTES.REPORTS:
        return <DescriptionIcon sx={{ color: "white" }} fontSize="large" />;
      case ROUTES.GRAPHICS:
        return <BarChartIcon sx={{ color: "white" }} fontSize="large" />;
      case ROUTES.SETTINGS:
        return <SettingsIcon sx={{ color: "white" }} fontSize="large" />;
      default:
        return <InboxIcon sx={{ color: "white" }} fontSize="large" />;
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
        <List
          sx={{
            backgroundColor: "var(--mui-palette-primary-main)",
            height: "100%",
          }}
        >
          {protectedRoutes.map((route) => (
            <NavLink key={route.route} to={`/${route.route}`}>
              {({ isActive }) => {
                const backgroundColor = isActive ? "#D5C7F9" : "inherit";
                return (
                  <ListItem sx={{ backgroundColor }} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>{renderIcon(route.route)}</ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                );
              }}
            </NavLink>
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
