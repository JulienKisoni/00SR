/* eslint-disable no-restricted-globals */

import { FileUpload } from "../../classes/FileUpload";

interface EventData {
  folderRef: string;
  type: string;
  file: Blob | File;
  filename: string;
}
interface UploadWorkerEvent extends MessageEvent {
  data: EventData;
}

// Listen for messages from the main thread
self.onmessage = (event: UploadWorkerEvent) => {
  const { file, filename, folderRef, type } = event.data;

  if (type === "INIT_FILE_UPLOAD") {
    const fileUpload = new FileUpload(folderRef);
    try {
      fileUpload.upload({
        file,
        filename,
        onError: (error) => {
          const errorMsg = error.publicMessage;
          // Send the result back to the main thread
          self.postMessage({ type: "ERROR_FILE_UPLOAD", errorMsg });
        },
        onSuccess: ({ downloadURL }) => {
          // Send the result back to the main thread
          self.postMessage({ type: "FINISH_FILE_UPLOAD", downloadURL });
        },
      });
    } catch (error) {
      const errorMsg = "Something went wrong";
      // Send the result back to the main thread
      self.postMessage({ type: "ERROR_FILE_UPLOAD", errorMsg });
    }
  }
};
