import dynamic from 'next/dynamic';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Menu } from '../../../models/users';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  data: Menu[];
  format?: (input: string) => string;
  label: string;
};
type Data = {
  name: string;
  data: number[];
};

const GraphDailyAverage: FC<Props> = ({ data, format, label }) => {
  const selectedName = useRecoilValue(selectedMakedMenuNameState);
  const [xLabel, setXLabel] = useState<string[]>([]);
  const [dataList, setDataList] = useState<Data[]>([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    createXLabel();
    dailyAverageFormula();
  }, [selectedName]);

  useEffect(() => {
    setOptions({
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: '1日の平均',
        align: 'left',
      },
      xaxis: {
        categories: xLabel,
      },
      yaxis: {
        formatter (val: number) {
          if (format === undefined) {
            return String(val);
          } 
            return format(String(val));
          
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter (val: number) {
            if (format === undefined) {
              return String(val);
            } 
              return format(String(val));
            
          },
        },
      },
    });
  }, [xLabel]);

  // Xラベル作成 (例2020/12/02)
  const createXLabel = () => {
    const xLabelAry: string[] = [];
    data.forEach((item) => {
      const strDateId = String(item.dateId);
      const formatDateId = `${strDateId.slice(4, 6)  }/${  strDateId.slice(6, 8)}`;
      xLabelAry.push(`${formatDateId}`);
    });
    setXLabel(xLabelAry);
  };

  // 1日の平均
  const dailyAverageFormula = () => {
    const averageArray: number[] = [];
    data.forEach((menu) => {
      let sum = 0;
      menu.recodes.forEach((recode) => {
        sum += Number(recode.value);
      });
      const len = menu.recodes.length;
      // 少数第二位四捨五入
      const average = Math.floor(sum / len);
      averageArray.push(average);
    });
    setDataList([{ name: `${label}`, data: averageArray }]);
  };

  return <Chart options={options} series={dataList} type="line" height={300} />;
};

export default GraphDailyAverage;
