/// <reference path="../../src/types/global.d.ts" />

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
  StorageError,
  StorageErrorCode,
} from "firebase/storage";

import { FileUpload } from "../../src/classes/FileUpload";
import { GenericError } from "../../src/classes/GenericError";

const dummyImgURL = "https://fakeurl.com/file";
const fakeFile: Blob = new Blob([], { type: "image/webp" });

const onUploadError = jest.fn();
const onUploadSuccess = jest.fn();

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

describe("FileUpload class", () => {
  describe("base64ToBlob", () => {
    test("Should throw error", async () => {
      const fileUpload = new FileUpload("ref");
      const blob = await fileUpload.base64ToBlob("test");
      expect(blob).toBe(null);
    });
  });
  describe("upload function", () => {
    describe("Error handling", () => {
      beforeEach(() => {
        mockedRef.mockReturnValue({} as StorageReference);
        mockedUploadBytesResumable.mockReturnValue(mockUploadTask);
        mockedGetDownloadURl.mockResolvedValue(dummyImgURL);
      });
      afterEach(() => {
        jest.resetAllMocks();
      });
      test("unauthorized", () => {
        jest.useFakeTimers();
        const fileUpload = new FileUpload("myRef");
        // Simulate the "state_changed" and completion callback
        mockOn.mockImplementation((_event, _progress, _error, complete) => {
          const code: StorageErrorCode = StorageErrorCode.UNAUTHORIZED;
          const storageError = new StorageError(code, "fake message");
          _error(storageError); // Simulating error completion
        });
        const genError = new GenericError("Unauthorized");
        fileUpload.upload({
          file: fakeFile,
          onError: onUploadError,
          onSuccess: onUploadSuccess,
          filename: "test-name",
        });
        expect(onUploadError).toHaveBeenCalledWith(genError);
      });
      test("canceled", () => {
        jest.useFakeTimers();
        const fileUpload = new FileUpload("myRef");
        // Simulate the "state_changed" and completion callback
        mockOn.mockImplementation((_event, _progress, _error, complete) => {
          const code: StorageErrorCode = StorageErrorCode.CANCELED;
          const storageError = new StorageError(code, "fake message");
          _error(storageError); // Simulating error completion
        });
        const genError = new GenericError("Operation canceled");
        fileUpload.upload({
          file: fakeFile,
          onError: onUploadError,
          onSuccess: onUploadSuccess,
          filename: "test-name",
        });
        expect(onUploadError).toHaveBeenCalledWith(genError);
      });
      test("unknown", () => {
        jest.useFakeTimers();
        const fileUpload = new FileUpload("myRef");
        // Simulate the "state_changed" and completion callback
        mockOn.mockImplementation((_event, _progress, _error, complete) => {
          const code: StorageErrorCode = StorageErrorCode.UNKNOWN;
          const storageError = new StorageError(code, "fake message");
          _error(storageError); // Simulating error completion
        });
        const genError = new GenericError("Unknown error");
        fileUpload.upload({
          file: fakeFile,
          onError: onUploadError,
          onSuccess: onUploadSuccess,
          filename: "test-name",
        });
        expect(onUploadError).toHaveBeenCalledWith(genError);
      });
      test("default case", () => {
        jest.useFakeTimers();
        const fileUpload = new FileUpload("myRef");
        // Simulate the "state_changed" and completion callback
        mockOn.mockImplementation((_event, _progress, _error, complete) => {
          const code: StorageErrorCode = StorageErrorCode.APP_DELETED;
          const storageError = new StorageError(code, "fake message");
          _error(storageError); // Simulating error completion
        });
        const genError = new GenericError("Something went wrong");
        fileUpload.upload({
          file: fakeFile,
          onError: onUploadError,
          onSuccess: onUploadSuccess,
          filename: "test-name",
        });
        expect(onUploadError).toHaveBeenCalledWith(genError);
      });
    });
  });
});
