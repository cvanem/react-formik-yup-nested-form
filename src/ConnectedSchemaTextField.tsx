import TextField from "@mui/material/TextField";
import useValueStore from "./useValueStore";
import { shallow } from "zustand/shallow";

const ConnectedSchemaTextField = ({ name, label, schemaId }) => {
  const { value, onChangeSchema, error } = useValueStore((state: any) => {
    return {
      value: state.values.schemaList[schemaId][name],
      onChangeSchema: state.onChangeSchema,
      error: (state.errors[schemaId] ?? {})[name],
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
      onChange={(e) =>
        onChangeSchema({ name, value: e?.target?.value, id: schemaId })
      }
      error={error}
      helperText={error}
    />
  );
};

export default ConnectedSchemaTextField;
