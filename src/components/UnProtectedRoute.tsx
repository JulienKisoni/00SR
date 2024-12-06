import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import { Navigate } from "react-router";

const UnProtectedRoute = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [state, setState] = useState({ loading: true, ready: false });
  useEffect(() => {
    setTimeout(() => {
      setState({ loading: false, ready: false });
    }, 2000);
  }, []);

  if (state.loading) {
    return <div>Loading...</div>;
  } else if (!state.loading && !state.ready) {
    return <Navigate to="/" replace />;
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default UnProtectedRoute;
