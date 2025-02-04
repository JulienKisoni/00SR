import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import React, { useMemo } from "react";

type TxtFieldProps = Omit<OutlinedInputProps, "variant">;
interface Props extends TxtFieldProps {
  helperText?: string;
  optional?: boolean;
}

const StyledInput: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  error,
  sx,
  id,
  placeholder,
  name,
  size,
  margin,
  label,
  helperText,
  optional = false,
  ...restProps
}): React.JSX.Element => {
  const displayedLabel = useMemo(() => {
    if (optional) {
      return label;
    }
    return `${label}*`;
  }, [label, optional]);
  return (
    <FormControl fullWidth variant="standard">
      <InputLabel margin="dense" shrink htmlFor={id}>
        {displayedLabel}
      </InputLabel>
      <OutlinedInput
        id={id}
        placeholder={placeholder}
        name={name}
        size={size || "small"}
        sx={{ marginTop: 2, ...sx }}
        margin={margin || "dense"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        {...restProps}
      />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default StyledInput;
