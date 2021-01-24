import moment from 'moment';
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
  axisLabel: string;
};
type Data = {
  name: string;
  data: number[];
};

const GraphAllData: FC<Props> = ({ data, format, label, axisLabel }) => {
  const selectedName = useRecoilValue(selectedMakedMenuNameState);
  const [xLabel, setXLabel] = useState<string[]>([]);
  const [dataList, setDataList] = useState<Data[]>([]);
  const [options, setOptions] = useState({});

  // xLabel作成 (例2020/12/02 1本目)
  useEffect(() => {
    createXLabel();
    dailyFormula();
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
        text: '全ての記録',
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

  const createXLabel = () => {
    const xLabelAry: string[] = [];
    data.forEach((item) => {
      item.recodes.forEach((recode, idx) => {
        if (recode.value === '') return;
        const strDateId = String(item.dateId);
        const formatDateId = moment(strDateId).format('MM/DD');
        xLabelAry.push(`${formatDateId} ${idx + 1}${axisLabel}`);
      });
    });
    setXLabel(xLabelAry);
  };

  // 日にちごとの変化
  const dailyFormula = () => {
    const array: number[] = [];
    data.forEach((menu) => {
      menu.recodes.forEach((recode) => {
        array.push(Number(recode.value));
      });
    });
    setDataList([{ name: `${label}`, data: array }]);
  };

  return <Chart options={options} series={dataList} type="line" height={300} />;
};

export default GraphAllData;
