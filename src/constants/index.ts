import { GridOffset, GridSize } from "@mui/material";
import { ResponsiveStyleValue } from "@mui/system";

interface GridProps {
  offset: ResponsiveStyleValue<GridOffset>;
  size: ResponsiveStyleValue<GridSize>;
}

export const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const centeredInputGridSystem: GridProps = {
  size: {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
  },
  offset: {
    xs: 0,
    sm: 0,
    md: 3,
    lg: 3,
    xl: 3,
  },
};
export const inputGridSystem: GridProps = {
  size: {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
  },
  offset: {
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0,
  },
};
