import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import React from "react";

type TxtFieldProps = Omit<OutlinedInputProps, "variant">;
interface Props extends TxtFieldProps {
  helperText?: string;
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
  ...restProps
}): React.JSX.Element => {
  return (
    <FormControl fullWidth variant="standard">
      <InputLabel margin="dense" shrink htmlFor={id}>
        {label}*
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
