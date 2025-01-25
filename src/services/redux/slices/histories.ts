import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";

type State = Types.IHistoryDocument[];
const initialState: State = [];

const createHistoryImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IHistoryDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteHistoriesImpl: CaseReducer<State> = (state, action) => {
  return [];
};
const updateHistoryImpl: CaseReducer<
  State,
  PayloadAction<{
    productId: string;
    dateKey: string;
    payload: Types.IEvolution;
  }>
> = (state, action) => {
  const index = state.findIndex(
    (history) => history.productId === action.payload.productId
  );
  if (index !== -1) {
    const actualHistory = cloneDeep(state[index]);
    const keyIndex = actualHistory.evolutions.findIndex(
      (evolution) => evolution.dateKey === action.payload.dateKey
    );
    if (keyIndex !== -1) {
      actualHistory.evolutions.splice(keyIndex, 1, action.payload.payload);
      // Update
    } else {
      // Push
      if (actualHistory.evolutions.length < 3) {
        actualHistory.evolutions.push(action.payload.payload);
      } else {
        actualHistory.evolutions.shift();
        actualHistory.evolutions.push(action.payload.payload);
      }
    }
    state.splice(index, 1, actualHistory);
  }
};

const historiesSlice = createSlice({
  name: "histories",
  initialState,
  reducers: {
    createHistory: createHistoryImpl,
    updateHistory: updateHistoryImpl,
    deleteHistories: deleteHistoriesImpl,
  },
});

export default historiesSlice;
export const { createHistory, updateHistory } = historiesSlice.actions;
