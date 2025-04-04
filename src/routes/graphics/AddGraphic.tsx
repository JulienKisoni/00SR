import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import GraphicFormCtrl from "../../components/controllers/forms/GraphicFormCtrl";
import { getStore } from "../../services/redux/store";

interface FormValues {
  name: string;
  description: string;
}
interface IState {
  tempTargetedProducts: Types.IHistoryDocument[];
}

const store = getStore();
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
      const productIDs = products.map((product) => product._id);
      const _histories = store
        .getState()
        .histories.filter((_history) =>
          productIDs.includes(_history.productId)
        );
      const histories: Types.IHistoryDocument[] = products.map((product) => {
        const evolutions =
          _histories.find((_history) => _history.productId === product._id)
            ?.evolutions || [];
        return {
          productId: product._id,
          productName: product.name,
          evolutions,
          storeId: product.storeId,
          createdAt: "",
        };
      });
      if (products?.length) {
        setState((prev) => ({ ...prev, tempTargetedProducts: histories }));
      }
    }
  }, []);

  if (!state.tempTargetedProducts.length) {
    return (
      <Container>
        <Stack direction="column">
          <Typography variant="h3" component="h1">
            Error
          </Typography>
          <Typography variant="subtitle2">No product(s) selected</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Stack direction="column">
      <Typography variant="h3" component="h1">
        Create graphic
      </Typography>
      <Typography mt={2} variant="subtitle1">
        You're about to create a graphic for the following product(s):
      </Typography>
      {state.tempTargetedProducts.map((product, idx) => {
        const lastIndex = idx === state.tempTargetedProducts.length - 1;
        const mb = lastIndex ? 4 : 0;
        return (
          <Typography
            mb={mb}
            key={product.productId}
            variant="subtitle1"
            ml={3}
          >
            {`- ${product.productName}`}
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
  );
};

export default AddGraphic;
