import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Types.IGraphicDocument[];
const initialState: State = [];

const createGraphicImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IGraphicDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteGraphicImpl: CaseReducer<
  State,
  PayloadAction<{ graphicId: string }>
> = (state, action) => {
  const index = state.findIndex(
    (graphic) => graphic._id === action.payload.graphicId
  );
  if (index !== -1) {
    state.splice(index, 1);
  }
};
const updateGraphicImpl: CaseReducer<
  State,
  PayloadAction<{ graphicId: string; payload: Partial<Types.IGraphicDocument> }>
> = (state, action) => {
  const index = state.findIndex(
    (graphic) => graphic._id === action.payload.graphicId
  );
  if (index !== -1) {
    const actualGraphic = state[index];
    const newGraphic: Types.IGraphicDocument = {
      ...actualGraphic,
      ...action.payload.payload,
    };
    state.splice(index, 1, newGraphic);
  }
};
const deleteGraphicsImpl: CaseReducer<
  State,
  PayloadAction<{ graphicIDs: string[] }>
> = (state, action) => {
  const filteredGraphics = state.filter(
    (graphic) => !action.payload.graphicIDs.includes(graphic._id)
  );
  return filteredGraphics;
};

const graphicsSlice = createSlice({
  name: "graphics",
  initialState,
  reducers: {
    createGraphic: createGraphicImpl,
    deleteGraphic: deleteGraphicImpl,
    updateGraphic: updateGraphicImpl,
    deleteGraphics: deleteGraphicsImpl,
  },
});

export default graphicsSlice;
export const { createGraphic, deleteGraphic, updateGraphic, deleteGraphics } =
  graphicsSlice.actions;
