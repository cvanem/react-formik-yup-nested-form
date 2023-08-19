import TextField from "@mui/material/TextField";
import useValueStore from "./useValueStore";
import { shallow } from "zustand/shallow";

const ConnectedTextField = ({ name, label }) => {
  const { value, onChangeValue, error } = useValueStore((state: any) => {
    return {
      value: state.values[name],
      onChangeValue: state.onChangeValue,
      error: state.errors[name],
    };
  }, shallow);

  return (
    <TextField
      fullWidth
      sx={{
        my: 2,
      }}
      label={label}
      value={value}
      onChange={(e) => onChangeValue({ name, value: e?.target?.value })}
      error={error}
      helperText={error}
    />
  );
};

export default ConnectedTextField;
