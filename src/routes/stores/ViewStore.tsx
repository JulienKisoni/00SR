import React, { useMemo } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";

import { RootState } from "../../services/redux/rootReducer";
import StoreFormCtlr from "../../components/controllers/forms/StoreFormCtrl";
import NotFound from "../NotFound";

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
    const userId = state.user.connectedUser?._id;
    return state.stores.find(
      (_store) => _store._id === storeId && _store.owner === userId
    );
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

  if (initialValues === null) {
    return <NotFound />;
  } else if (!store?._id) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <React.Fragment>
      <Stack direction="column">
        <Typography variant="h3" component="h1">
          {store?.name}
        </Typography>
        <Typography variant="subtitle1">
          View picture and other information about your store
        </Typography>
        <StoreFormCtlr
          mode="readonly"
          initialValues={initialValues}
          defaultImgSrc={store?.picture || ""}
          storeId={store?._id || ""}
        />
      </Stack>
    </React.Fragment>
  );
};

export default ViewStore;
