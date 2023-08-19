import { create } from "zustand";
import { isEmpty, uuid } from "./helpers";
import merge from "deepmerge";

const getInitialSchemaValues = ({ schemaId }) => {
  const firstNodeId = uuid();
  const secondNodeId = uuid();
  return {
    jobTypes: "",
    config: "",
    nodes: {
      [firstNodeId]: { name: "", type: null, parentId: undefined, schemaId },
      [secondNodeId]: { name: "", type: null, parentId: firstNodeId, schemaId },
    },
  };
};

const firstSchemaId = uuid();

const initialValues = {
  tableConfig: "",
  schemaList: {
    [firstSchemaId]: getInitialSchemaValues({ schemaId: firstSchemaId }),
  },
};

const useValueStore = create((set, get) => ({
  values: initialValues,
  errors: {},
  onValidate: () => {
    const state = get() as any;
    var errors = {};

    // Implement any necessary validations here
    console.log("onValidate - Validation logic to be implemented...", state);
    if (isEmpty(state.values.tableConfig)) {
      errors["tableConfig"] = "Table config is required.";
    }

    Object.keys(state?.values?.schemaList).forEach((schemaId) => {
      const schema = state.values.schemaList[schemaId];
      const schemaErrors = {};
      if (isEmpty(schema.jobTypes)) {
        schemaErrors["jobTypes"] = "Job types are required!";
      }
      if (isEmpty(schema.config)) {
        schemaErrors["config"] = "Config is required!";
      }

      if (Object.keys(schemaErrors).length > 0) {
        errors = merge(errors, { [schemaId]: schemaErrors }); // Merge any schema errors into the errors object
      }
      // Validate any schema fields here and populate newErrors if applicable
      Object.keys(schema.nodes ?? {}).forEach((nodeId) => {
        const node = schema.nodes[nodeId];
        const nodeErrors = {};
        if (isEmpty(node.name)) {
          nodeErrors["name"] = "Name is required.";
        }
        if (isEmpty(node.type)) {
          nodeErrors["type"] = "Type is required.";
        }
        if (Object.keys(nodeErrors).length > 0) {
          errors = merge(errors, {
            [schemaId]: { [nodeId]: nodeErrors }, // Merge any node errors into the errors object if applicable
          });
        }
      });
    });

    set((state: any) => {
      return {
        ...state,
        errors,
      };
    });

    return errors;
  },
  onSubmit: () => {
    const state = get();
    console.log("onSubmit - Submit logic to be implemented...", state);
  },
  addSchema: () => {
    set((state: any) => {
      const schemaId = uuid();
      const newState = {
        ...state,
        values: {
          ...state.values,
          schemaList: {
            ...state.values.schemaList,
            [schemaId]: getInitialSchemaValues({ schemaId }),
          },
        },
      };
      console.log("addSchema", { schemaId, newState, state });
      return newState;
    });
  },
  removeSchema: ({ id }) => {
    console.log("removeSchema", { id });
    set((state: any) => {
      const schemaList = {};
      Object.keys(state.values.schemaList)
        .filter((k) => k !== id)
        .forEach((k) => {
          schemaList[k] = state.values.schemaList[k];
        });
      return {
        ...state,
        values: { ...state.values, schemaList },
      };
    });
  },
  onChangeValue: ({ name, value }) => {
    console.log("onChangeValue", { name, value });
    set((state: any) => {
      return {
        ...state,
        values: {
          ...state.values,
          [name]: value,
        },
      };
    });
  },
  onChangeSchema: ({ id, name, value }) => {
    console.log("onChangeSchema", { id, name, value });
    set((state: any) => {
      return {
        ...state,
        values: {
          ...state.values,
          schemaList: {
            ...state.values.schemaList,
            [id]: {
              ...state.values.schemaList[id],
              [name]: value,
            },
          },
        },
      };
    });
  },
  onChangeNode: ({ id, schemaId, values }) => {
    console.log("onChangeNode", { id, schemaId, values });
    set((state: any) => {
      const schema = state.values.schemaList[schemaId];
      const nodes = {};
      Object.keys(schema.nodes ?? {}).forEach((k) => {
        if (k === id) {
          nodes[k] = { ...schema.nodes[k], ...values }; // Update on change values
        } else {
          nodes[k] = schema.nodes[k];
        }
      });
      const schemaList = {};
      Object.keys(state.values.schemaList).forEach((k) => {
        if (k === schemaId) {
          schemaList[k] = {
            ...state.values.schemaList[k],
            nodes,
          };
        } else {
          schemaList[k] = state.values.schemaList[k];
        }
      });
      return {
        ...state,
        values: { ...state.values, schemaList },
      };
    });
  },
  addNode: ({ parentId, schemaId, name = undefined, type = undefined }) => {
    console.log("addNode", { parentId, schemaId, name, type });
    set((state: any) => {
      const newId = uuid();
      return {
        ...state,
        values: {
          ...state.values,
          schemaList: {
            ...state.values.schemaList,
            [schemaId]: {
              ...state.values.schemaList[schemaId],
              nodes: {
                ...state.values.schemaList[schemaId].nodes,
                [newId]: { schemaId, parentId, name, type },
              },
            },
          },
        },
      };
    });
  },
  removeNode: ({ id, schemaId }) => {
    console.log("removeNode", { id, schemaId });
    set((state: any) => {
      const schema = state.values.schemaList[schemaId];
      const nodes = {};
      console.log({ schema });
      Object.keys(schema.nodes ?? {})
        .filter((k) => k !== id)
        .forEach((k) => {
          nodes[k] = schema.nodes[k];
        });
      const schemaList = {};
      Object.keys(state.values.schemaList).forEach((k) => {
        if (k === schemaId) {
          schemaList[k] = {
            ...state.values.schemaList[k],
            nodes,
          };
        } else {
          schemaList[k] = state.values.schemaList[k];
        }
      });
      console.log("removing node", { state, nodes, schemaList });
      return {
        ...state,
        values: { ...state.values, schemaList },
      };
    });
  },
}));

export default useValueStore;
