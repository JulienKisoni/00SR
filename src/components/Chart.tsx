import React, { useMemo } from "react";
import BarChart from "@mui/x-charts/BarChart/BarChart";
import groupBy from "lodash.groupby";
import cloneDeep from "lodash.clonedeep";

interface EnhanceEvolution extends Types.IEvolution {
  productId: string;
}
interface Props {
  graphic?: Types.IGraphicDocument;
}
const Chart = ({ graphic }: Props) => {
  const series = useMemo(() => {
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
    const clonedHistories = cloneDeep(histories);
    clonedHistories.forEach((history) => {
      history.evolutions = [];
      for (const [dateKey, enhancedEvolutions] of Object.entries(group)) {
        const index = enhancedEvolutions.findIndex(
          (evolution) => evolution.productId === history.productId
        );
        if (index !== -1) {
          history.evolutions.push(enhancedEvolutions[index]);
        } else {
          history.evolutions.push({} as Types.IEvolution);
        }
      }
    });
    console.log({ group, clonedHistories });
  }, [graphic]);

  return <div>Chart</div>;
};

export default Chart;
