import React, { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useNavigate, useParams } from "react-router";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

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

  const graphicProducts: Types.IProductDocument[] = useMemo(
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
      <Container>
        <div>Loading</div>
      </Container>
    );
  } else if (state.deny) {
    return <Navigate to={`/${ROUTES.GRAPHICS}`} replace />;
  }

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          {graphic?.name}
        </Typography>
        <Typography variant="subtitle2">
          Update the name and/or the description of your graphic
        </Typography>
        <Typography variant="subtitle2">
          You're about to edit a graphic of the following product(s)
        </Typography>
        {graphicProducts.map((product) => {
          return (
            <Typography key={product._id} variant="subtitle2">
              {`- Order #${product.name}`}
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
    </Container>
  );
};

export default EditGraphic;
