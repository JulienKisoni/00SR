import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ReportFormCtrl from "../../components/controllers/forms/ReportFormCtrl";

interface FormValues {
  name: string;
  description: string;
}
const initialValues: FormValues = {
  name: "",
  description: "",
};

const AddReport = () => {
  const orders: Types.IOrderDocument[] = [];
  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          Create report
        </Typography>
        <Typography variant="subtitle2">
          You're about to create a report for the following order(s)
        </Typography>
        {orders.map((order) => {
          return (
            <Typography variant="subtitle2">
              {`- Order #${order.orderNumber}`}
            </Typography>
          );
        })}
        <ReportFormCtrl
          mode="add"
          initialValues={initialValues}
          reportId=""
          orders={orders}
        />
      </Stack>
    </Container>
  );
};

export default AddReport;
