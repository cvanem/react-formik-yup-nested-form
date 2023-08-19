import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { AddCircleOutline } from "@mui/icons-material";
import { Grid } from "@mui/material";
import useValueStore from "./useValueStore";
import { shallow } from "zustand/shallow";
import ConnectedTextField from "./ConnectedTextField";
import Schema from "./Schema";

export const dataModels: DataModel = {
  typeOptions: [
    { value: null, label: "" },
    { value: "date", label: "date" },
    { value: "string", label: "string" },
    { value: "number", label: "number" },
  ],
  jobTypes: [
    { value: null, label: "" },
    {
      value: "summarizedByDateAggregation",
      label: "summarizedByDateAggregation",
    },
    { value: "dataGrid", label: "dataGrid" },
    { value: "gaCategories", label: "gaCategories" },
  ],
};

type DataModel = {
  [key: string]: DataModelItem[];
};

type DataModelItem = {
  label: string;
  value: string | null;
  type?: string;
};

const App = () => {
  const { schemaIds, addSchema, onValidate, onSubmit } = useValueStore(
    (state: any) => {
      return {
        state,
        schemaIds: Object.keys(state.values.schemaList),
        addSchema: state.addSchema,
        onValidate: state.onValidate,
        onSubmit: state.onSubmit,
      };
    },
    shallow
  );

  const handleSubmit = React.useCallback(() => {
    console.log("Submitting");
    const errors = onValidate();
    if (Object.keys(errors).length > 0) {
      console.log("Error submitting!", errors);
    } else {
      onSubmit();
    }
  }, [onValidate, onSubmit]);

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <ConnectedTextField name="tableConfig" label="Table Config" />
      <IconButton
        onClick={addSchema}
        sx={{
          my: 2,
          px: 2,
          borderRadius: "5px",
          color: "#1976D2",
          border: "1px solid #1976D2",
        }}
      >
        <AddCircleOutline sx={{ mr: 1 }} />
        Add Schema
      </IconButton>
      <Grid container>
        {schemaIds.map((id, index) => (
          <Grid key={id} item xs={12}>
            <Schema id={id} index={index} />
          </Grid>
        ))}
      </Grid>
      <Button
        onClick={handleSubmit}
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          py: 1,
          mt: 2,
          mb: 4,
          fontSize: "20px",
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default App;
