import React, { useMemo, useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useParams } from "react-router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import NotFound from "../NotFound";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { StoreSrv } from "../../services/controllers/StoreSrv";

interface FormValues {
  name: string;
  description: string;
}

const ViewGraphic = () => {
  const { graphicId } = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState({ deny: false });

  const graphic = useSelector((state: RootState) => {
    return state.graphics.find((_graphic) => _graphic._id === graphicId);
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  const usersSrv = useMemo(() => new UsersSrv(dispatch), [dispatch]);
  const storesSrv = useMemo(() => new StoreSrv(dispatch), [dispatch]);
  const loading = useMemo(() => {
    if (!graphic || !selectedStore || !connectedUser) {
      return true;
    }
    return false;
  }, [graphic, selectedStore, connectedUser]);
  const graphicOwnerName = useMemo(() => {
    if (!connectedUser || !graphic) {
      return null;
    }
    const { error, data } = usersSrv.getOne<Types.IUserDocument>({
      _id: graphic.owner,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.profile.username;
    } else {
      return null;
    }
  }, [graphic, connectedUser, usersSrv]);
  const graphicStoreName = useMemo(() => {
    if (!connectedUser || !graphic) {
      return null;
    }
    const { error, data } = storesSrv.getOne<Types.IStoreDocument>({
      _id: graphic.storeId,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.name;
    } else {
      return null;
    }
  }, [graphic, connectedUser, storesSrv]);

  useEffect(() => {
    if (connectedUser?._id && graphic?._id) {
      if (connectedUser._id !== graphic.owner) {
        alert("You do not have access to this graphic");
        setState((prev) => ({ ...prev, deny: true }));
      }
    }
  }, [connectedUser, graphic]);

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
    return <Navigate to={`/${ROUTES.REPORTS}`} replace />;
  }

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          {graphic?.name}
        </Typography>
        <Typography variant="subtitle2">
          View details about your graphic
        </Typography>
        <Typography variant="subtitle2">
          Created by: {graphicOwnerName}
        </Typography>
        <Typography variant="subtitle2">
          Created at: {graphic?.createdAt}
        </Typography>
        <Typography variant="subtitle2">Store: {graphicStoreName}</Typography>
        <Typography variant="subtitle2">
          Description: {graphic?.description}
        </Typography>
        <Typography variant="subtitle2">PRODUCTS DETAILS</Typography>
      </Stack>
    </Container>
  );
};

export default ViewGraphic;
