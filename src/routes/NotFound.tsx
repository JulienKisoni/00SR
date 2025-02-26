import React, { useEffect } from "react";

function NotFound() {
  useEffect(() => {
    console.log("NotFound rendered");
  }, []);
  return <div data-testid="NotFound">NotFound</div>;
}

export default NotFound;
