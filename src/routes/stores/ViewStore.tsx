import React, { useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router";
import { shallowEqual, useSelector } from "react-redux";

import { RootState } from "../../services/redux/rootReducer";
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

const ViewStore = () => {
  const { storeId } = useParams();

  const store = useSelector((state: RootState) => {
    return state.stores.find((_store) => _store._id === storeId);
  }, shallowEqual);

  const initialValues: FormValues | null = useMemo(() => {
    if (!store) {
      return null;
    }
    const values: FormValues = {
      ...store.address,
      name: store.name,
      description: store.description,
    };
    return values;
  }, [store]);

  return (
    <Container>
      {!initialValues ? (
        <div>Loading</div>
      ) : (
        <Stack spacing={2.5} direction="column">
          <Typography variant="h3" component="h1">
            {store?.name}
          </Typography>
          <Typography variant="subtitle2">
            View picture and other information about your store
          </Typography>
          <StoreFormCtlr
            mode="readonly"
            initialValues={initialValues}
            defaultImgSrc={store?.picture || ""}
            storeId={store?._id || ""}
          />
        </Stack>
      )}
    </Container>
  );
};

export default ViewStore;
