import React from "react";
import type { PropsWithChildren } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Navigate } from "react-router";

import { RootState } from "../services/redux/rootReducer";

const UnProtectedRoute = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  if (
    connectedUser !== undefined &&
    connectedUser !== null &&
    connectedUser._id
  ) {
    return <Navigate to="/" replace />;
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default UnProtectedRoute;
