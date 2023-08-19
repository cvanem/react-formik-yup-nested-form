import TextField from "@mui/material/TextField";
import useValueStore from "./useValueStore";
import { shallow } from "zustand/shallow";
import { Autocomplete } from "@mui/material";

const ConnectedSchemaAutoComplete = ({ name, label, options, schemaId }) => {
  const { value, onChangeSchema, error } = useValueStore((state: any) => {
    return {
      value: state.values.schemaList[schemaId][name] ?? null,
      onChangeSchema: state.onChangeSchema,
      error: (state.errors[schemaId] ?? {})[name],
    };
  }, shallow);

  return (
    <Autocomplete
      fullWidth
      sx={{
        my: 2,
      }}
      options={options}
      getOptionLabel={(option) => option.label}
      value={options.find((o) => o.value === value) ?? null}
      onChange={(e, option) =>
        onChangeSchema({ id: schemaId, name, value: option?.value ?? null })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={error ?? ""}
        />
      )}
    />
  );
};

export default ConnectedSchemaAutoComplete;
