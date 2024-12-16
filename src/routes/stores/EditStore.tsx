import React, { useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useNavigate, useParams } from "react-router";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import StoreFormCtlr from "../../components/controllers/forms/StoreFormCtrl";
import { RootState } from "../../services/redux/rootReducer";
import { StoreSrv } from "../../services/controllers/StoreSrv";
import { ROUTES } from "../../constants/routes";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}

const EditStore = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleDeleteStore = useCallback(() => {
    if (store) {
      const message = `Are you sure you wanna delete this store (${store.name})?`;
      // eslint-disable-next-line no-restricted-globals
      const agree = confirm(message);
      if (agree) {
        const storesSrv = new StoreSrv(dispatch);
        storesSrv.deleteOne(store._id);
        alert("Store deleted");
        navigate(`/${ROUTES.STORES}`);
      }
    }
  }, [store, dispatch, navigate]);

  return (
    <Container>
      {!initialValues ? (
        <div>Loading</div>
      ) : (
        <Stack spacing={2.5} direction="column">
          <Typography variant="h3" component="h1">
            Update store
          </Typography>
          <Typography variant="subtitle2">
            Edit picture and other information about your store
          </Typography>
          <StoreFormCtlr
            mode="edit"
            initialValues={initialValues}
            defaultImgSrc={store?.picture || ""}
            onDeleteStore={handleDeleteStore}
            storeId={store?._id || ""}
          />
        </Stack>
      )}
    </Container>
  );
};

export default EditStore;
