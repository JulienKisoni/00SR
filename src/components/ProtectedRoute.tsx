import React from "react";
import type { PropsWithChildren } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Navigate } from "react-router";

import { RootState } from "../services/redux/rootReducer";

const ProtectedRoute = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  if (connectedUser === null) {
    return <Navigate to="/login" replace />;
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
