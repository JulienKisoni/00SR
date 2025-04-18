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
import WidgetsIcon from "@mui/icons-material/Widgets";
import { NavLink } from "react-router";

import { protectedRoutes, ROUTES } from "../constants/routes";

const drawerWidth = 72;

const AppDrawer = ({ children }: PropsWithChildren) => {
  const renderIcon = useCallback((route: ROUTES): React.JSX.Element => {
    switch (route) {
      case ROUTES.STORES:
        return (
          <DomainIcon
            data-testid="stores-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      case ROUTES.PRODUCTS:
        return (
          <StoreIcon
            data-testid="products-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      case ROUTES.CART:
        return (
          <ShoppingCartIcon
            data-testid="cart-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      case ROUTES.ORDERS:
        return (
          <ReceiptIcon
            data-testid="orders-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      case ROUTES.REPORTS:
        return (
          <DescriptionIcon
            data-testid="reports-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      case ROUTES.GRAPHICS:
        return (
          <BarChartIcon
            data-testid="graphics-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      case ROUTES.SETTINGS:
        return (
          <SettingsIcon
            data-testid="settings-icon"
            sx={{ color: "white" }}
            fontSize="large"
          />
        );
      default:
        return <InboxIcon sx={{ color: "white" }} fontSize="large" />;
    }
  }, []);
  return (
    <Box data-testid="drawer-container" sx={{ display: "flex" }}>
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
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <WidgetsIcon sx={{ color: "white" }} fontSize="large" />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
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
