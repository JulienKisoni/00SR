import React from "react";
import { useSelector } from "react-redux";

import type { RootState } from "../services/redux/rootReducer";
import AppDrawer from "./AppDrawer";
import { ConnectedNavigation, NotConnectedNavigation } from "../routes";

const Navigation = () => {
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser || null;
  });

  if (connectedUser) {
    return (
      <AppDrawer>
        <ConnectedNavigation />
      </AppDrawer>
    );
  }
  return <NotConnectedNavigation />;
};

export default Navigation;
