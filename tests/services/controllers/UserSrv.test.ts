/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import store from "../../../src/services/redux/store";
import { UsersSrv } from "../../../src/services/controllers/UserSrv";

let mockDispatch: Dispatch<UnknownAction>;

describe("UserSrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
  });
  describe("addOne", () => {
    test("should return error", () => {
      const user: Types.IUserDocument = {
        _id: "123",
        email: "user@mail.com",
        password: "password",
        storeIds: [],
        profile: {
          username: "username",
          picture: "picture_uri",
          role: "user",
        },
        createdAt: new Date().toISOString(),
      };
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        users: [user],
      });
      const userSrv = new UsersSrv(mockDispatch);
      const result = userSrv.addOne(user);
      expect(result.error).toBeDefined();
    });
  });
  describe("getOne", () => {
    test("should return null data", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        users: [],
      });
      const userSrv = new UsersSrv(mockDispatch);
      const result = userSrv.getOne({ _id: "123" });
      expect(result.data).toBe(null);
    });
  });
  describe("login", () => {
    test("should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        users: [],
      });
      const userSrv = new UsersSrv(mockDispatch);
      const result = userSrv.login({
        email: "user@mail.com",
        password: "password",
      });
      expect(result.error).toBeDefined();
    });
  });
  describe("updateOne", () => {
    test("should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        users: [],
      });
      const userSrv = new UsersSrv(mockDispatch);
      const result = userSrv.updateOne("123", { email: "username@mail.com" });
      expect(result.error).toBeDefined();
    });
  });
  describe("updatePassword", () => {
    test("should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        users: [],
      });
      const userSrv = new UsersSrv(mockDispatch);
      const result = userSrv.updatePassword({
        userId: "123",
        email: "user@mail.com",
        password: "password",
        newPassword: "newPassword",
      });
      expect(result.error).toBeDefined();
    });
  });
  describe("recoverPassword", () => {
    test("should return error", async () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        users: [],
      });
      const userSrv = new UsersSrv(mockDispatch);
      const result = await userSrv.recoverPassword({
        email: "user@mail.com",
      });
      expect(result.error).toBeDefined();
    });
  });
});
