import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { Autocomplete, Grid } from "@mui/material";
import useValueStore from "./useValueStore";
import { shallow } from "zustand/shallow";
import { dataModels } from "./App";

const Node = ({ id, schemaId, level }: any) => {
  const { node, errors, childIds, addNode, removeNode, onChangeNode } =
    useValueStore((state: any) => {
      const schema = state.values.schemaList[schemaId];
      const schemaErrors = state.errors[schemaId] ?? {};
      return {
        node: schema.nodes[id],
        errors: schemaErrors[id] ?? {},
        childIds: Object.keys(schema.nodes).filter(
          (k) => schema.nodes[k].parentId === id
        ),
        addNode: state.addNode,
        removeNode: state.removeNode,
        onChangeNode: state.onChangeNode,
      };
    }, shallow);

  const { name, type = null, parentId } = node;

  const handleChange = React.useCallback(
    (name) => (e: any) =>
      onChangeNode({ id, schemaId, values: { [name]: e?.target?.value } }),
    [onChangeNode, id, schemaId]
  );

  return (
    <>
      <Box
        key={id}
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          p: "8px",
          my: "8px",
          backgroundColor: "#f9f9f9",
          ml: level * 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={1}>
          <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 1 }}>
            {parentId === undefined ? "Node" : `Child Node`} Level {level + 1},
            id: {id}
          </Typography>
          <Box flexGrow={1} />
          <IconButton
            aria-label="delete"
            disabled={childIds.length > 0}
            onClick={() => removeNode({ id, schemaId })}
            sx={{
              backgroundColor: "#ffebee",
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
          >
            <DeleteOutline />
          </IconButton>
        </Stack>
        <TextField
          fullWidth
          sx={{
            my: 2,
          }}
          label="Name"
          value={name}
          onChange={handleChange("name")}
          error={errors["name"]}
          helperText={errors["name"] ?? ""}
        />
        <Autocomplete
          fullWidth
          sx={{
            my: 2,
          }}
          options={dataModels.typeOptions}
          getOptionLabel={(option) => option.label}
          value={dataModels.typeOptions.find((o) => o.value === type) ?? null}
          onChange={(e, option) => {
            console.log("onChange", { e, option });
            onChangeNode({ id, schemaId, values: { type: option?.value } });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type"
              error={errors["type"]}
              helperText={errors["type"] ?? ""}
            />
          )}
        />
        <IconButton
          onClick={() => addNode({ parentId: id, schemaId })}
          sx={{
            my: 2,
            px: 2,
            borderRadius: "5px",
            color: "#1976D2",
            border: "1px solid #1976D2",
          }}
        >
          <AddCircleOutline sx={{ mr: 1 }} />
          Add Child Node
        </IconButton>
      </Box>
      <Grid container sx={{ pl: level }}>
        {childIds.map((cid: any) => (
          <Grid key={cid} item xs={12}>
            <Node id={cid} schemaId={schemaId} level={level + 1} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Node;
