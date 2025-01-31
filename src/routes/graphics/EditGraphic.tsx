import React, { useCallback, useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useNavigate, useParams } from "react-router";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";

import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import NotFound from "../NotFound";
import GraphicFormCtrl from "../../components/controllers/forms/GraphicFormCtrl";
import { GraphicSrv } from "../../services/controllers/GraphicSrv";

interface FormValues {
  name: string;
  description: string;
}

const EditGraphic = () => {
  const { graphicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({ deny: false });

  const graphicSrv = useMemo(() => new GraphicSrv(dispatch), [dispatch]);

  const graphic = useSelector((state: RootState) => {
    return state.graphics.find((_graphic) => _graphic._id === graphicId);
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  const graphicProducts: Types.IHistoryDocument[] = useMemo(
    () => graphic?.products || [],
    [graphic?.products]
  );

  const loading = useMemo(() => {
    if (!graphic || !selectedStore || !connectedUser) {
      return true;
    }
    return false;
  }, [graphic, selectedStore, connectedUser]);

  useEffect(() => {
    const condition1 =
      connectedUser && graphic && connectedUser?._id !== graphic?.owner;
    const condition2 =
      graphic && selectedStore && graphic.storeId !== selectedStore._id;
    if (condition1 || condition2) {
      alert("You do not have access to this graphic");
      setState((prev) => ({ ...prev, deny: true }));
    }
  }, [selectedStore, graphic, connectedUser]);

  const initialValues: FormValues | null = useMemo(() => {
    if (!graphic) {
      return null;
    }
    const values: FormValues = {
      name: graphic.name,
      description: graphic.description,
    };
    return values;
  }, [graphic]);

  const handleDeleteGraphic = useCallback(() => {
    if (graphic) {
      const message = `Are you sure you wanna delete this graphic (${graphic.name})?`;
      // eslint-disable-next-line no-restricted-globals
      const agree = confirm(message);
      if (agree) {
        graphicSrv.deleteOne(graphic._id);
        alert("Graphic deleted");
        navigate(`/${ROUTES.GRAPHICS}`, { replace: true });
      }
    }
  }, [graphic, graphicSrv, navigate]);

  if (initialValues === null) {
    return <NotFound />;
  }
  if (loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (state.deny) {
    return <Navigate to={`/${ROUTES.GRAPHICS}`} replace />;
  }

  return (
    <Stack direction="column">
      <Typography variant="h3" component="h1">
        {graphic?.name}
      </Typography>
      <Typography mt={2} variant="subtitle1">
        Update the name and/or the description of your graphic
      </Typography>
      <Typography variant="subtitle1">
        You're about to edit a graphic of the following product(s)
      </Typography>
      {graphicProducts.map((product, idx) => {
        const lastIndex = idx === graphicProducts.length - 1;
        const mb = lastIndex ? 4 : 0;
        return (
          <Typography
            mb={mb}
            ml={3}
            key={product.productId}
            variant="subtitle1"
          >
            {`- Order #${product.productName}`}
          </Typography>
        );
      })}
      <GraphicFormCtrl
        mode="edit"
        initialValues={initialValues}
        onDeleteGraphic={handleDeleteGraphic}
        graphicId={graphic?._id || ""}
        createdAt={graphic?.createdAt}
        products={graphicProducts}
      />
    </Stack>
  );
};

export default EditGraphic;
