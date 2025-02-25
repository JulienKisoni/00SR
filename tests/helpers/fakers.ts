import { RootState } from "../../src/services/redux/rootReducer";

export const generateFakeStore = (values: Partial<RootState>): RootState => {
  const store: RootState = {
    users: [],
    stores: [],
    user: {
      connectedUser: null,
      selectedStore: null,
    },
    products: [],
    cart: {},
    orders: [],
    reports: [],
    graphics: [],
    histories: [],
    _persist: {
      version: 1,
      rehydrated: true,
    },
    ...values,
  };
  return store;
};
