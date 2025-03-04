/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import UpdateProfileCtrl from "../../../src/components/controllers/UpdateProfileCtrl";
import { FileUpload } from "../../../src/classes/FileUpload";

const dummyImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII";
const dummyImgURL = "https://fakeurl.com/file";
const dummyDevices: MediaDeviceInfo[] = [
  {
    deviceId: "deviceId1",
    groupId: "groupId1",
    kind: "videoinput",
    label: "label",
    toJSON() {},
  },
];

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));
jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);
const mockEnumerateDevices = jest.fn();

/* Mock MediaDevices */
// Here we're mocking fake media devices so the webcam can return a screenshot
const fakeMedia = {
  stop: () => {},
};

Object.defineProperty(navigator, "mediaDevices", {
  value: {
    enumerateDevices: mockEnumerateDevices,
    getUserMedia: jest.fn().mockResolvedValue(fakeMedia),
  },
});
/* End of Mock */

// Mock Firebase Storage functions
jest.mock("firebase/storage", () => ({
  ...jest.requireActual("firebase/storage"),
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
}));
const mockedRef = jest.mocked(ref);
const mockedUploadBytesResumable = jest.mocked(uploadBytesResumable);
const mockedGetDownloadURl = jest.mocked(getDownloadURL);

const mockOn = jest.fn();
const mockUploadTask: UploadTask = {
  on: mockOn,
  cancel: jest.fn(),
  catch: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  then: jest.fn(),
  snapshot: { ref: {} } as UploadTaskSnapshot, // Mock reference for snapshot
};
/* End mock Firebase */

/* Mock for React-Webcam */
const mockReactWebcamScreenshot = ({
  image,
  height,
  width,
}: {
  image: string;
  height?: number;
  width?: number;
}) => {
  const videoHeight = height || 360;
  const videoWidth = width || 720;

  // This is necessary to avoid an `unstable_flushDiscreteUpdates` warning
  Object.defineProperty(HTMLMediaElement.prototype, "muted", {
    set: () => {},
  });

  Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", {
    get: () => videoHeight,
  });

  Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", {
    get: () => videoWidth,
  });

  const mockCanvasRenderingContext = {
    drawImage: () => {},
    translate: () => {},
    scale: () => {},
  };

  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    // @ts-ignore
    .mockImplementation(() => mockCanvasRenderingContext);

  jest
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockImplementation(() => image);
};
/* End of Mock */

const user: Types.IUserDocument = {
  _id: "123",
  email: "johndoe@mail.com",
  password: "johndoe",
  profile: {
    username: "johndoe",
    picture: "picture_uri",
    role: "user",
  },
  createdAt: new Date().toISOString(),
};
const users: Types.IUserDocument[] = [user];
const store1: Types.IStoreDocument = {
  _id: "store1",
  name: "My store",
  owner: user._id,
  picture: "picture_uri",
  products: [],
  description: "My store description",
  address: {
    line1: "123 daddy street",
    country: "CANADA",
    state: "Québec",
    city: "Montreal",
  },
  active: true,
  createdAt: new Date().toISOString(),
};
const store2: Types.IStoreDocument = {
  _id: "store2",
  name: "My store",
  owner: user._id,
  picture: "picture_uri",
  products: [],
  description: "My store description",
  address: {
    line1: "123 daddy street",
    country: "CANADA",
    state: "Québec",
    city: "Montreal",
  },
  active: true,
  createdAt: new Date().toISOString(),
};
const stores = [store1, store2];

describe("Update Profile Feature", () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
  describe("User can pick upload a profile picture by using his webcam", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: store1 },
      });
      mockEnumerateDevices.mockResolvedValue(dummyDevices);
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockReactWebcamScreenshot({ image: dummyImage });

      mockedRef.mockReturnValue({} as StorageReference);
      mockedUploadBytesResumable.mockReturnValue(mockUploadTask);
      mockedGetDownloadURl.mockResolvedValue(dummyImgURL);
      // Simulate the "state_changed" and completion callback
      mockOn.mockImplementation((_event, _progress, _error, complete) => {
        complete(); // Simulating successful completion
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      const fakeFile: Blob = new Blob([], { type: "image/webp" });
      const mockBase64ToBlob = jest
        .spyOn(FileUpload.prototype, "base64ToBlob")
        .mockResolvedValue(fakeFile);
      await act(async () => {
        renderWithProviders(<UpdateProfileCtrl />, { preloadedState: state });
      });
      const openMenuBtn = await screen.findByTestId("open-menu-btn");

      await act(async () => {
        userEvent.click(openMenuBtn);
      });
      const takePictureBtn = screen.queryByTestId("take-picture-menu-item");

      await waitFor(async () => {
        expect(takePictureBtn).toBeInTheDocument();
      });

      await act(async () => {
        userEvent.click(takePictureBtn!);
      });

      expect(mockEnumerateDevices).toHaveBeenCalledTimes(1);

      const webcamView = screen.queryByTestId("webcam-view");
      const modalSaveBtn = screen.queryByTestId("modal-save-btn");

      await waitFor(async () => {
        expect(modalSaveBtn).toBeInTheDocument();
      });
      await waitFor(async () => {
        expect(webcamView).toBeInTheDocument();
      });

      await act(async () => {
        userEvent.click(modalSaveBtn!);
      });

      expect(mockBase64ToBlob).toHaveBeenCalledTimes(1);
      expect(mockedRef).toHaveBeenCalledTimes(1);
      expect(mockedUploadBytesResumable).toHaveBeenCalledTimes(1);
      expect(mockedGetDownloadURl).toHaveBeenCalledTimes(1);

      expect(mockShow).toHaveBeenCalledWith("Upload success", {
        autoHideDuration: 5000,
        severity: "success",
      });
    });
  });
  describe("User can update his profile by filling all the required fields", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: store1 },
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<UpdateProfileCtrl />, { preloadedState: state });
      });
      const username = await screen.findByTestId("username");
      const submitProfile = await screen.findByTestId("profile-submit");

      expect(submitProfile).toBeDisabled();

      await act(async () => {
        userEvent.type(username, "update");
      });

      await waitFor(async () => {
        expect(submitProfile).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitProfile);
      });

      expect(mockShow).toHaveBeenCalledWith("Profile updated successfully", {
        autoHideDuration: 5000,
        severity: "success",
      });
    });
  });
  describe("User cannot update his profile by omitting one required field", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: store1 },
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<UpdateProfileCtrl />, { preloadedState: state });
      });
      const email = await screen.findByTestId("email");
      const submitProfile = await screen.findByTestId("profile-submit");

      expect(submitProfile).toBeDisabled();

      await act(async () => {
        userEvent.clear(email);
      });

      expect(submitProfile).toBeDisabled();
    });
  });
  describe("User can remove his profile picture", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: store1 },
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<UpdateProfileCtrl />, { preloadedState: state });
      });
      const removeBtn = await screen.findByTestId("remove-picture");

      expect(removeBtn).toBeEnabled();

      await act(async () => {
        userEvent.click(removeBtn);
      });

      expect(mockShow).toHaveBeenCalledWith("Picture removed successfully", {
        autoHideDuration: 5000,
        severity: "success",
      });
    });
  });
});
