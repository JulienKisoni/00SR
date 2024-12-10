import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { firebaseStorage } from "../services/firebase";
import { GenericError } from "./GenericError";

interface UploadArgs {
  file: File;
  onSuccess: ({ downloadURL }: { downloadURL: string }) => void;
  onError: (error: GenericError) => void;
}
interface CropImageArgs {
  imageSrc: string;
  crop: any;
  zoom: number;
  aspect: number;
  file: File;
}

export class FileUpload {
  folderRef: string;

  constructor(folderRef: string) {
    this.folderRef = folderRef;
  }

  private createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; // Prevent CORS issues
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.src = url;
    });
  }

  uploadFile({ file, onError, onSuccess }: UploadArgs) {
    const storageRef = ref(firebaseStorage, `${this.folderRef}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // const progress =
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            // console.log("Upload is paused");
            break;
          case "running":
            // console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        let errorMessage: string;
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            errorMessage = "Unauthorized";
            break;
          case "storage/canceled":
            // User canceled the upload
            errorMessage = "Operation canceled";
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            errorMessage = "Unknown error";
            break;
          default:
            errorMessage = "Something went wrong";
        }
        const _error = new GenericError(errorMessage);
        onError(_error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          onSuccess({ downloadURL });
        });
      }
    );
  }
  async getCroppedImg({
    imageSrc,
    crop,
    zoom,
    aspect,
    file,
  }: CropImageArgs): Promise<Blob | null> {
    const image = await this.createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const croppedWidth = image.width / zoom;
    const croppedHeight = croppedWidth / aspect;

    canvas.width = croppedWidth;
    canvas.height = croppedHeight;

    const x = crop.x * (image.width / 100);
    const y = crop.y * (image.height / 100);

    return new Promise((resolve, reject) => {
      if (!ctx) {
        reject("Something went wrong while extracting image");
      } else {
        ctx.drawImage(
          image,
          x,
          y,
          croppedWidth,
          croppedHeight, // Source
          0,
          0,
          croppedWidth,
          croppedHeight // Destination
        );
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.name,
          1
        ); // Image format and quality
      }
    });
  }
}
