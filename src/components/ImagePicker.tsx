import React, {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useState,
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
  profilePicture: string;
}
interface PickerState {
  finalSrc: string;
  showCrop: boolean;
  cropSrc: string;
  crop: Point;
  croppedAreaPixels: Area | null;
  file: File | null;
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

const ImagePicker = ({ alt, profilePicture }: ImagePickerProps) => {
  const [state, setState] = useState<PickerState>({
    finalSrc: profilePicture || "",
    showCrop: false,
    crop: initialCrop,
    cropSrc: "",
    file: null,
    croppedAreaPixels: null,
  });

  const handleClose = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showCrop: false,
      file: null,
      cropSrc: "",
      crop: initialCrop,
    }));
  }, []);
  const handleCropping = useCallback((c: Point) => {
    console.log("Cropping ", c);
    setState((prev) => ({ ...prev, crop: c }));
  }, []);
  const handleCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setState((prev) => ({ ...prev, croppedAreaPixels }));
  }, []);
  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files !== null) {
      const file = files[0];
      console.log({ name: file.name });
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log("image loaded from reader");
        setState((prev) => ({
          ...prev,
          file,
          showCrop: true,
          cropSrc: reader.result?.toString() || "",
        }));
      });
      reader.addEventListener("error", (error) => {
        console.log("Error file reader ", { error });
      });
      reader.readAsDataURL(file);
    } else {
      console.log("No file");
    }
  }, []);
  const handleSave = useCallback(async () => {
    try {
      if (state.croppedAreaPixels && state.file) {
        const fileUpload = new FileUpload("images");
        const image = await fileUpload.getCroppedImg({
          imageSrc: state.cropSrc,
          crop: state.croppedAreaPixels,
          zoom: 1,
          aspect: 1,
          file: state.file,
        });
        console.log({ image });
      } else {
        console.log("No image");
      }
    } catch (error: any) {
      const _error = new GenericError(error?.message, "Error cropping image");
      alert(_error.publicMessage);
    }
  }, [state]);

  return (
    <div>
      {state.finalSrc ? (
        <img src={state.finalSrc} alt={alt} />
      ) : (
        <p>No Final image yet</p>
      )}
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
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
            zoom={1}
            aspect={1}
            onCropChange={handleCropping}
            onCropComplete={handleCropComplete}
          />
        </ModalComp>
      ) : null}
    </div>
  );
};

export default ImagePicker;
