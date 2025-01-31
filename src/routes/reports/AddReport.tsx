import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ReportFormCtrl from "../../components/controllers/forms/ReportFormCtrl";

interface FormValues {
  name: string;
  description: string;
}
interface IState {
  tempTargetedOrders: Types.IOrderDocument[];
}

const initialValues: FormValues = {
  name: "",
  description: "",
};

const AddReport = () => {
  const [state, setState] = useState<IState>({ tempTargetedOrders: [] });

  useEffect(() => {
    const payload = localStorage.getItem("tempTargetedOrders");
    if (payload) {
      const orders: Types.IOrderDocument[] = JSON.parse(payload);
      if (orders?.length) {
        setState((prev) => ({ ...prev, tempTargetedOrders: orders }));
      }
    }
  }, []);

  if (!state.tempTargetedOrders.length) {
    return (
      <Container>
        <Stack direction="column">
          <Typography variant="h3" component="h1">
            Error
          </Typography>
          <Typography variant="subtitle1">No order(s) selected</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Stack direction="column">
      <Typography variant="h3" component="h1">
        Create report
      </Typography>
      <Typography mt={2} variant="subtitle1">
        You're about to create a report for the following order(s):
      </Typography>
      {state.tempTargetedOrders.map((order, idx) => {
        const lastIndex = idx === state.tempTargetedOrders.length - 1;
        const mb = lastIndex ? 4 : 0;
        return (
          <Typography mb={mb} ml={3} key={order._id} variant="subtitle1">
            {`- Order #${order.orderNumber}`}
          </Typography>
        );
      })}
      <ReportFormCtrl
        mode="add"
        initialValues={initialValues}
        reportId=""
        orders={state.tempTargetedOrders}
      />
    </Stack>
  );
};

export default AddReport;
