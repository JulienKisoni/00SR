import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { Area } from "react-easy-crop";

import { firebaseStorage } from "../services/firebase";
import { GenericError } from "./GenericError";

interface UploadArgs {
  file: Blob | File;
  filename: string;
  onSuccess: ({ downloadURL }: { downloadURL: string }) => void;
  onError: (error: GenericError) => void;
}
interface CropImageArgs {
  imageSrc: string;
  crop: Area;
  zoom: number;
  aspect: number;
  file: File;
}

export class FileUpload {
  private folderRef: string;

  constructor(folderRef: string) {
    this.folderRef = folderRef;
  }

  private createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; // Prevent CORS issues
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (error) => reject(error);
      image.src = url;
    });
  }

  upload({ file, onError, onSuccess, filename }: UploadArgs) {
    const storageRef = ref(firebaseStorage, `${this.folderRef}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
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

    const croppedWidth = crop.width / zoom;
    const croppedHeight = croppedWidth / aspect;

    canvas.width = croppedWidth;
    canvas.height = croppedHeight;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const x = crop.x * scaleX;
    const y = crop.y * scaleY;

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

  base64ToBlob(base64: string): Promise<Blob | null> {
    return new Promise((resolve) => {
      try {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const byteArray = new Uint8Array(byteArrays);
        const file = new Blob([byteArray], { type: "image/webp" });
        resolve(file);
      } catch (error) {
        resolve(null);
      }
    });
  }
}
