import React, {
  memo,
  useState,
  useCallback,
  ChangeEventHandler,
  useMemo,
} from "react";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import type { OutlinedInputProps } from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import debounce from "lodash.debounce";

interface Props extends OutlinedInputProps {
  onEndTyping: (value: string) => void;
}

const SearchBar = ({ onEndTyping, ...restProps }: Props) => {
  const [search, setSearch] = useState("");

  const debouncedEndTyping = useMemo(
    () => debounce(onEndTyping, 1000),
    [onEndTyping]
  );
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = useCallback(
    (event) => {
      const value = event.target.value;
      setSearch(value);
      debouncedEndTyping(value);
    },
    [debouncedEndTyping]
  );

  return (
    <OutlinedInput
      id="searchbar"
      startAdornment={
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      }
      aria-describedby="outlined-weight-helper-text"
      value={search}
      onChange={handleChange}
      {...restProps}
    />
  );
};

export default memo(SearchBar);
