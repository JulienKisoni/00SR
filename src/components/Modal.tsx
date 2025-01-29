import React, { PropsWithChildren } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;
}
const Modal = ({
  children,
  onClose,
  onSave,
  opened,
}: PropsWithChildren<ModalProps>) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullScreen={fullScreen}
      fullWidth
    >
      <Toolbar sx={{ backgroundColor: "var(--mui-palette-primary-main)" }}>
        <DialogTitle color="white">Resize your picture</DialogTitle>
      </Toolbar>
      <DialogContent sx={{ height: "70vh", padding: 0 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {children}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
