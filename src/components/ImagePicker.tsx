import React, {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

import { FileUpload } from "../classes/FileUpload";
import { GenericError } from "../classes/GenericError";

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

const modalContentWrapperStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  height: "70vh",
  //   width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;
}
interface ImagePickerProps {
  alt: string;
  defaultSrc: string;
  onSuccess: ({ downloadURL }: { downloadURL: string }) => void;
  onError: (error: GenericError) => void;
}
interface PickerState {
  finalSrc: string;
  showCrop: boolean;
  cropSrc: string;
  crop: Point;
  croppedAreaPixels: Area | null;
  file: File | null;
  zoom: number;
}

const initialCrop = {
  x: 0,
  y: 0,
};

const ModalComp = ({
  children,
  onClose,
  onSave,
  opened,
}: PropsWithChildren<ModalProps>) => {
  return (
    <Modal
      open={opened}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalContentWrapperStyle}>
        <Stack direction="column">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Modal header
          </Typography>
          {children}
          <Stack direction="row">
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Modal footer
            </Typography>
            <Button onClick={onSave}>Save</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

const ImagePicker = ({
  alt,
  defaultSrc,
  onError,
  onSuccess,
}: ImagePickerProps) => {
  const [state, setState] = useState<PickerState>({
    finalSrc: defaultSrc || "https://placehold.co/400",
    showCrop: false,
    crop: initialCrop,
    cropSrc: "",
    file: null,
    croppedAreaPixels: null,
    zoom: 1,
  });

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
  const handleSave = useCallback(async () => {
    try {
      if (state.croppedAreaPixels && state.file) {
        const fileUpload = new FileUpload("images");
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
            onError: (err) => {
              onError(err);
              setState((prev) => ({
                ...prev,
                showCrop: false,
                crop: initialCrop,
                cropSrc: "",
                file: null,
                croppedAreaPixels: null,
              }));
            },
            onSuccess: (data) => {
              onSuccess(data);
              setState((prev) => ({
                ...prev,
                showCrop: false,
                crop: initialCrop,
                cropSrc: "",
                file: null,
                croppedAreaPixels: null,
              }));
            },
          });
        }
      }
    } catch (error: any) {
      const _error = new GenericError(error?.message, "Error cropping image");
      alert(_error.publicMessage);
    }
  }, [state, onError, onSuccess]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: "3px",
          borderColor: "black",
          borderStyle: "solid",
          width: 120,
          height: 120,
          padding: 5,
        }}
      >
        <img width="100%" height="100%" src={state.finalSrc} alt={alt} />
      </div>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        style={{ marginBottom: 20 }}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={onFileChange}
          multiple={false}
        />
      </Button>
      {state.showCrop && state.cropSrc && state.file ? (
        <ModalComp
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
        </ModalComp>
      ) : null}
    </div>
  );
};

export default ImagePicker;
