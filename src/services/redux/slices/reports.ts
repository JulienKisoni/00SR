import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Types.IReportDocument[];
const initialState: State = [];

const createReportImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IReportDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteReportImpl: CaseReducer<
  State,
  PayloadAction<{ reportId: string }>
> = (state, action) => {
  const index = state.findIndex(
    (report) => report._id === action.payload.reportId
  );
  if (index !== -1) {
    state.splice(index, 1);
  }
};
const updateReportImpl: CaseReducer<
  State,
  PayloadAction<{ reportId: string; payload: Partial<Types.IReportDocument> }>
> = (state, action) => {
  const index = state.findIndex(
    (report) => report._id === action.payload.reportId
  );
  if (index !== -1) {
    const actualStore = state[index];
    const newReport: Types.IReportDocument = {
      ...actualStore,
      ...action.payload.payload,
    };
    state.splice(index, 1, newReport);
  }
};
const deleteReportsImpl: CaseReducer<
  State,
  PayloadAction<{ reportIDs: string[] }>
> = (state, action) => {
  const filteredReports = state.filter(
    (report) => !action.payload.reportIDs.includes(report._id)
  );
  return filteredReports;
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    createReport: createReportImpl,
    deleteReport: deleteReportImpl,
    updateReport: updateReportImpl,
    deleteReports: deleteReportsImpl,
  },
});

export default reportsSlice;
export const { createReport, deleteReport, updateReport, deleteReports } =
  reportsSlice.actions;
