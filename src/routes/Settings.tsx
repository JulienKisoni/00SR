import React, { useState, useCallback, useEffect } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { UsersSrv } from "../services/controllers/UserSrv";
import { ROUTES } from "../constants/routes";
import UpdatePasswordCtrl from "../components/controllers/UpdatePasswordCtrl";
import UpdateProfileCtrl from "../components/controllers/UpdateProfileCtrl";
import { RootState } from "../services/redux/rootReducer";
import { inputGridSystem } from "../constants";

const Settings = () => {
  const [state, setState] = useState<{
    tabIndex: number;
    selectedStore: Types.IStoreDocument | null;
  }>({ tabIndex: 0, selectedStore: null });

  const stores = useSelector((state: RootState) => {
    const data = state.stores.filter(
      (store) => store.owner === state.user.connectedUser?._id && store.active
    );
    return data;
  }, shallowEqual);
  const initialSelectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);

  useEffect(() => {
    if (initialSelectedStore?._id) {
      setState((prev) => ({ ...prev, selectedStore: initialSelectedStore }));
    }
  }, [initialSelectedStore]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setState((prev) => ({ ...prev, tabIndex: newValue }));
    },
    []
  );
  const handleLogout = useCallback(() => {
    const usersSrv = new UsersSrv(dispatch);
    usersSrv.logout();
    navigate(`/${ROUTES.SIGNIN}`);
  }, [dispatch, navigate]);

  const onSelectStore = useCallback(
    (event: SelectChangeEvent<string>) => {
      const storeId = event.target.value;
      const store = stores.find((store) => store._id === storeId);
      if (store) {
        const usersSrv = new UsersSrv(dispatch);
        usersSrv.selectStore(store);
      }
    },
    [stores, dispatch]
  );

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          Settings
        </Typography>
        <Typography variant="subtitle2">
          Update your profile information and perform some actions.
        </Typography>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={state.tabIndex}>
          <Grid container direction={"column"}>
            <Grid {...inputGridSystem}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  width: "fit-content",
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Actions" value={0} />
                  <Tab label="Profile" value={1} />
                  <Tab label="Password" value={2} />
                </TabList>
              </Box>
            </Grid>
          </Grid>
          <TabPanel value={0}>
            <Grid container direction={"column"} spacing={2}>
              <Grid {...inputGridSystem}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="labelId-selected-store">
                    Selected store
                  </InputLabel>
                  <Select
                    id="selected-store"
                    labelId="labelId-selected-store"
                    size="small"
                    sx={{ marginTop: 2 }}
                    variant="outlined"
                    name="selectedStore"
                    onChange={onSelectStore}
                    disabled={!stores.length}
                    value={state.selectedStore?._id || ""}
                  >
                    {stores.map((state) => (
                      <MenuItem key={state._id} value={state._id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Stack direction="row">
                <Button color="error" variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
                <Button
                  sx={{ marginLeft: 2 }}
                  color="error"
                  variant="contained"
                >
                  Delete account
                </Button>
              </Stack>
            </Grid>
          </TabPanel>
          <TabPanel value={1}>
            <UpdateProfileCtrl />
          </TabPanel>
          <TabPanel value={2}>
            <UpdatePasswordCtrl />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Settings;
