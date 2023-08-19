import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import useValueStore from "./useValueStore";
import { shallow } from "zustand/shallow";
import { dataModels } from "./App";
import { Grid } from "@mui/material";
import Node from "./Node";
import ConnectedSchemaAutoComplete from "./ConnectedSchemaAutoComplete";
import ConnectedSchemaTextField from "./ConnectedSchemaTextField";

const Schema = ({ id, index }) => {
  const { addNode, removeSchema, nodeIds } = useValueStore((state: any) => {
    return {
      addNode: state.addNode,
      removeSchema: state.removeSchema,
      nodeIds: Object.keys(state.values.schemaList[id].nodes ?? {}).filter(
        (k) => state.values.schemaList[id].nodes[k].parentId === undefined
      ),
    };
  }, shallow);

  return (
    <Box
      key={id}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        p: "10px",
        my: "10px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={1}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 1 }}>
          Schema List {index + 1}, id: {id}
        </Typography>
        <Box flexGrow={1} />
        <IconButton
          aria-label="delete"
          onClick={() => removeSchema({ id })}
          sx={{
            backgroundColor: "#ffebee",
            borderRadius: "50%",
            border: "1px solid #ccc",
          }}
        >
          <DeleteOutline />
        </IconButton>
      </Stack>
      <ConnectedSchemaAutoComplete
        label="Job Types"
        options={dataModels.jobTypes}
        schemaId={id}
        name="jobTypes"
      />
      <ConnectedSchemaTextField name={`config`} label="Config" schemaId={id} />
      <IconButton
        onClick={() => addNode({ parentId: undefined, schemaId: id })}
        sx={{
          my: 2,
          px: 2,
          borderRadius: "5px",
          color: "#1976D2",
          border: "1px solid #1976D2",
        }}
      >
        <AddCircleOutline sx={{ mr: 1 }} />
        Add Node
      </IconButton>
      <Grid container>
        {nodeIds.map((nodeId) => (
          <Grid key={nodeId} item xs={12}>
            <Node id={nodeId} schemaId={id} level={0} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Schema;
