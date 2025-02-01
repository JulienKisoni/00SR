import React, {
  ChangeEvent,
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CreateIcon from "@mui/icons-material/Create";
import { styled } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { useNotifications } from "@toolpad/core";
import type Webcam from "react-webcam";

import { FileUpload } from "../classes/FileUpload";
import { GenericError } from "../classes/GenericError";
import Modal from "./Modal";
import PeripheralCam from "./PeripheralCam";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface ImagePickerProps {
  alt: string;
  defaultSrc: string;
  onSuccess: ({ downloadURL }: { downloadURL: string }) => void;
  onError: (error: GenericError) => void;
  disabled: boolean;
  allowTakePicture?: boolean;
}
interface PickerState {
  finalSrc: string;
  showPeripheralCam: boolean;
  showCrop: boolean;
  cropSrc: string;
  crop: Point;
  croppedAreaPixels: Area | null;
  file: File | null;
  zoom: number;
  uploading: boolean;
  menuOpen: boolean;
  anchorEl: (EventTarget & HTMLButtonElement) | null;
}

const initialCrop = {
  x: 0,
  y: 0,
};

const ImagePicker = ({
  alt,
  defaultSrc,
  onError,
  onSuccess,
  disabled = false,
  allowTakePicture = false,
}: ImagePickerProps) => {
  const [state, setState] = useState<PickerState>({
    finalSrc: defaultSrc || "https://placehold.co/400",
    showCrop: false,
    crop: initialCrop,
    cropSrc: "",
    file: null,
    croppedAreaPixels: null,
    zoom: 1,
    uploading: false,
    menuOpen: false,
    anchorEl: null,
    showPeripheralCam: false,
  });
  const notifications = useNotifications();
  const webcamRef: React.Ref<Webcam> | undefined = useRef(null);
  const fileUpload = useMemo(() => new FileUpload("images"), []);

  useEffect(() => {
    if (defaultSrc && defaultSrc !== state.finalSrc) {
      setState((prev) => ({ ...prev, finalSrc: defaultSrc }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSrc]);

  const handleClose = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showCrop: false,
      file: null,
      cropSrc: "",
      crop: initialCrop,
    }));
  }, []);
  const handleClosePeripheral = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showPeripheralCam: false,
    }));
  }, []);
  const handleZoomChange = useCallback((z: number) => {
    setState((prev) => ({ ...prev, zoom: z }));
  }, []);
  const handleCropping = useCallback((c: Point) => {
    setState((prev) => ({ ...prev, crop: c }));
  }, []);
  const handleCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setState((prev) => ({ ...prev, croppedAreaPixels }));
  }, []);
  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files !== null) {
      const file = files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setState((prev) => ({
          ...prev,
          file,
          showCrop: true,
          cropSrc: reader.result?.toString() || "",
        }));
      });
      reader.addEventListener("error", (error) => {
        console.error("Error file reader ", { error });
      });
      reader.readAsDataURL(file);
    }
  }, []);
  const onUploadError = useCallback(
    (err: GenericError) => {
      onError(err);
      setState((prev) => ({
        ...prev,
        showCrop: false,
        crop: initialCrop,
        cropSrc: "",
        file: null,
        croppedAreaPixels: null,
        uploading: false,
      }));
    },
    [onError]
  );
  const onUploadSuccess = useCallback(
    (data: { downloadURL: string }) => {
      console.log({ url: data.downloadURL });
      onSuccess(data);
      setState((prev) => ({
        ...prev,
        showCrop: false,
        crop: initialCrop,
        cropSrc: "",
        file: null,
        croppedAreaPixels: null,
        uploading: false,
      }));
    },
    [onSuccess]
  );
  const handleSave = useCallback(async () => {
    try {
      if (state.croppedAreaPixels && state.file) {
        setState((prev) => ({ ...prev, uploading: true }));
        const params = {
          imageSrc: state.cropSrc,
          crop: state.croppedAreaPixels,
          zoom: state.zoom,
          aspect: 1,
          file: state.file,
        };
        const image = await fileUpload.getCroppedImg(params);
        if (image) {
          const croppedImageURL = URL.createObjectURL(image); // Preview cropped image
          console.log({ croppedImageURL });
          setState((prev) => ({
            ...prev,
            finalSrc: croppedImageURL,
          }));
          fileUpload.upload({
            file: image,
            filename: state.file.name,
            onError: onUploadError,
            onSuccess: onUploadSuccess,
          });
        }
      }
    } catch (error: any) {
      const _error = new GenericError(error?.message, "Error cropping image");
      notifications.show(_error.publicMessage, {
        autoHideDuration: 5000,
        severity: "error",
      });
      setState((prev) => ({ ...prev, uploading: false }));
    }
  }, [state, notifications, fileUpload, onUploadSuccess, onUploadError]);
  const handleMenuBtnClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setState((prev) => ({
        ...prev,
        menuOpen: true,
        anchorEl: event.currentTarget,
      }));
    },
    []
  );
  const onTakePicture = useCallback(async () => {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter(
      ({ kind }) => kind === "videoinput"
    );
    if (videoDevices?.length) {
      setState((prev) => ({
        ...prev,
        menuOpen: false,
        anchorEl: null,
        showPeripheralCam: true,
      }));
    } else {
      notifications.show("No video peripheral available", {
        autoHideDuration: 5000,
        severity: "error",
      });
    }
  }, [notifications]);
  const capture = useCallback(async () => {
    if (webcamRef?.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log({ imageSrc });
      setState((prev) => ({
        ...prev,
        showPeripheralCam: false,
        uploading: true,
      }));
      try {
        const blob = await fileUpload.base64ToBlob(imageSrc || "");
        console.log({ blob });
        if (!blob) {
          notifications.show("Could not upload your picture", {
            autoHideDuration: 5000,
            severity: "error",
          });
          setState((prev) => ({ ...prev, uploading: false }));
          return;
        }
        fileUpload.upload({
          file: blob,
          filename: "selfie",
          onError: onUploadError,
          onSuccess: onUploadSuccess,
        });
      } catch (error) {
        notifications.show("Could not upload your picture", {
          autoHideDuration: 5000,
          severity: "error",
        });
        setState((prev) => ({ ...prev, uploading: false }));
      }
    } else {
      notifications.show("Could not take a picture", {
        autoHideDuration: 5000,
        severity: "error",
      });
    }
  }, [webcamRef, notifications, onUploadError, onUploadSuccess, fileUpload]);

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 120,
          padding: 5,
          backgroundColor: "lightgrey",
          borderRadius: "50%",
          position: "relative",
        }}
      >
        <Avatar
          sx={{ width: "100%", height: "100%" }}
          src={state.finalSrc}
          alt={alt}
        />
        <Button
          size="small"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          disabled={disabled}
          className="btn--upload__icon"
          sx={{ marginBottom: 2, backgroundColor: "white" }}
          onClick={handleMenuBtnClick}
        >
          <CreateIcon fontSize="small" sx={{ color: "black" }} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={state.anchorEl}
          open={state.menuOpen}
          onClose={() => {
            setState((prev) => ({ ...prev, menuOpen: false }));
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem>
            <Button
              component="label"
              role={undefined}
              variant="text"
              tabIndex={-1}
              sx={{ padding: 0, color: "black" }}
            >
              Pick from Gallery
              <VisuallyHiddenInput
                type="file"
                onChange={onFileChange}
                multiple={false}
              />
            </Button>
          </MenuItem>
          {allowTakePicture ? (
            <MenuItem onClick={onTakePicture}>Take a picture</MenuItem>
          ) : null}
        </Menu>
      </div>
      <Button
        disabled={disabled}
        variant="text"
        sx={{ textDecoration: "underline" }}
      >
        Remove picture
      </Button>
      {state.showCrop && state.cropSrc && state.file && !state.uploading ? (
        <Modal
          opened={state.showCrop}
          onClose={handleClose}
          onSave={handleSave}
        >
          <Cropper
            image={state.cropSrc}
            crop={state.crop}
            zoom={state.zoom}
            aspect={1}
            onZoomChange={handleZoomChange}
            onCropChange={handleCropping}
            onCropComplete={handleCropComplete}
          />
        </Modal>
      ) : null}
      {!state.showCrop && !state.uploading && state.showPeripheralCam ? (
        <Modal
          opened={state.showPeripheralCam}
          onClose={handleClosePeripheral}
          onSave={capture}
          saveLabel="Take picture"
          modalHeaderText="Take a selfie of you"
        >
          <PeripheralCam webcamRef={webcamRef} />
        </Modal>
      ) : null}
      {state.uploading ? (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
    </React.Fragment>
  );
};

export default ImagePicker;
