import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import StoreFormCtlr from "../../components/controllers/forms/StoreFormCtrl";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}
const initialValues: FormValues = {
  line1: "",
  line2: "",
  country: "Canada",
  state: "",
  city: "",
  name: "",
  description: "",
};

const AddStore = () => {
  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          Add store
        </Typography>
        <Typography variant="subtitle2">
          Add a picture and other information about your store
        </Typography>
        <StoreFormCtlr
          mode="add"
          initialValues={initialValues}
          defaultImgSrc=""
        />
      </Stack>
    </Container>
  );
};

export default AddStore;
