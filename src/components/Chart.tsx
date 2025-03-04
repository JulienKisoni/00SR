import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import groupBy from "lodash.groupby";
import cloneDeep from "lodash.clonedeep";

const getColor = (index: number) => {
  switch (index) {
    case 0:
      return "pink";
    case 1:
      return "lightgreen";
    case 2:
      return "lightblue";
    default:
      return "lightgrey";
  }
};

interface Serie extends Types.IHistoryDocument {
  data: (number | null)[];
  type: "bar";
  color: string;
  label: string;
}
interface State {
  series: Serie[];
  xAxisData: string[];
}

interface EnhanceEvolution extends Types.IEvolution {
  productId: string;
}
interface Props {
  graphic?: Types.IGraphicDocument;
}

const Chart = ({ graphic }: Props) => {
  const [state, setState] = useState<State>({ series: [], xAxisData: [] });

  useEffect(() => {
    const histories = graphic?.products || [];
    let allEvolutions: EnhanceEvolution[] = [];

    histories.forEach((history) => {
      allEvolutions = [
        ...allEvolutions,
        ...history.evolutions.map((evolution) => ({
          ...evolution,
          productId: history.productId,
        })),
      ];
    });

    const group = groupBy(allEvolutions, "dateKey");

    const tempSeries: Serie[] = cloneDeep(histories).map((history, idx) => ({
      ...history,
      data: [],
      type: "bar",
      color: getColor(idx),
      label: history.productName,
    }));
    tempSeries.forEach((serie) => {
      serie.data = [];
      serie.evolutions = [];
      for (const enhancedEvolutions of Object.values(group)) {
        const index = enhancedEvolutions.findIndex(
          (evolution) => evolution.productId === serie.productId
        );
        if (index !== -1) {
          serie.data.push(enhancedEvolutions[index].quantity);
          serie.evolutions.push(enhancedEvolutions[index]);
        } else {
          serie.data.push(null);
          serie.evolutions.push({} as Types.IEvolution);
        }
      }
    });
    setState({ series: tempSeries, xAxisData: Object.keys(group) });
  }, [graphic]);

  return (
    <BarChart
      data-testid="bar-chart"
      height={400}
      series={state.series}
      xAxis={[{ scaleType: "band", data: state.xAxisData }]}
    />
  );
};

export default Chart;
