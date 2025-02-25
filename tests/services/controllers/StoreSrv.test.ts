/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { getStore } from "../../../src/services/redux/store";
import { StoreSrv } from "../../../src/services/controllers/StoreSrv";

const store = getStore();
let mockDispatch: Dispatch<UnknownAction>;

describe("StoreSrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
  });
  describe("getOne", () => {
    test("should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        stores: [],
      });
      const storeSrv = new StoreSrv(mockDispatch);
      const result = storeSrv.getOne({ _id: "123" });
      expect(result.error).toBeDefined();
    });
  });
});
