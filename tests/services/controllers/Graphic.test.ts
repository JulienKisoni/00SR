/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import store from "../../../src/services/redux/store";
import { GraphicSrv } from "../../../src/services/controllers/GraphicSrv";

let mockDispatch: Dispatch<UnknownAction>;

describe("GraphicSrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
  });
  describe("addOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      const graphic = {
        _id: "123",
        name: "name",
        description: "description",
        owner: "abc",
        storeId: "xyz",
        products: [],
        createdAt: new Date().toISOString(),
      };
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        graphics: [graphic],
      });
      const graphicSrv = new GraphicSrv(mockDispatch);
      const result = graphicSrv.addOne(graphic);
      expect(result.error).toBeDefined();
    });
  });
  describe("getOne", () => {
    test("Should return undefined", () => {
      const actualStore = store.getState();
      const graphic = {
        _id: "123",
        name: "name",
        description: "description",
        owner: "abc",
        storeId: "xyz",
        products: [],
        createdAt: new Date().toISOString(),
      };
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        graphics: [graphic],
      });
      const graphicSrv = new GraphicSrv(mockDispatch);
      const result = graphicSrv.getOne({ graphicId: "1234" });
      expect(result.data).toBe(undefined);
    });
  });
  describe("deleteOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      const graphic = {
        _id: "123",
        name: "name",
        description: "description",
        owner: "abc",
        storeId: "xyz",
        products: [],
        createdAt: new Date().toISOString(),
      };
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        graphics: [graphic],
      });
      const graphicSrv = new GraphicSrv(mockDispatch);
      const result = graphicSrv.deleteOne("7777");
      expect(result.error).toBeDefined();
    });
  });
});
