import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import GraphicFormCtrl from "../../components/controllers/forms/GraphicFormCtrl";

interface FormValues {
  name: string;
  description: string;
}
interface IState {
  tempTargetedProducts: Types.IProductDocument[];
}

const initialValues: FormValues = {
  name: "",
  description: "",
};

const AddGraphic = () => {
  const [state, setState] = useState<IState>({ tempTargetedProducts: [] });

  useEffect(() => {
    const payload = localStorage.getItem("tempTargetedProducts");
    if (payload) {
      const products: Types.IProductDocument[] = JSON.parse(payload);
      if (products?.length) {
        setState((prev) => ({ ...prev, tempTargetedProducts: products }));
      }
    }
  }, []);

  if (!state.tempTargetedProducts.length) {
    return (
      <Container>
        <Stack spacing={2.5} direction="column">
          <Typography variant="h3" component="h1">
            Error
          </Typography>
          <Typography variant="subtitle2">No product(s) selected</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          Create graphic
        </Typography>
        <Typography variant="subtitle2">
          You're about to create a graphic for the following product(s)
        </Typography>
        {state.tempTargetedProducts.map((product) => {
          return (
            <Typography key={product._id} variant="subtitle2">
              {product.name}
            </Typography>
          );
        })}
        <GraphicFormCtrl
          mode="add"
          initialValues={initialValues}
          graphicId=""
          products={state.tempTargetedProducts}
        />
      </Stack>
    </Container>
  );
};

export default AddGraphic;
