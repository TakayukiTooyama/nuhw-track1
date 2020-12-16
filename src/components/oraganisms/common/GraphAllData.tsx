import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';

import { Menu } from '../../../models/users';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  data: Menu[];
  insertStr?: (input: string) => string;
  label: string;
  axisLabel: string;
};
type Data = {
  name: string;
  data: number[];
};

const GraphAllData: FC<Props> = ({ data, insertStr, label, axisLabel }) => {
  const selectedName = useRecoilValue(selectedMakedMenuNameState);
  const [xLabel, setXLabel] = useState<string[]>([]);
  const [dataList, setDataList] = useState<Data[]>([]);
  const [options, setOptions] = useState({});

  //xLabel作成 (例2020/12/02 1本目)
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
        formatter: function (val: number) {
          if (insertStr === undefined) {
            return String(val);
          } else {
            return insertStr(String(val));
          }
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val: number) {
            if (insertStr === undefined) {
              return String(val);
            } else {
              return insertStr(String(val));
            }
          },
        },
      },
    });
  }, [xLabel]);

  const createXLabel = () => {
    let xLabelAry: string[] = [];
    data.forEach((item) => {
      item.recodes.forEach((recode, idx) => {
        if (recode.value === '') return;
        const strDateId = String(item.dateId);
        const formatDateId =
          strDateId.slice(4, 6) + '/' + strDateId.slice(6, 8);
        xLabelAry.push(`${formatDateId} ${idx + 1}${axisLabel}`);
      });
    });
    setXLabel(xLabelAry);
  };

  //日にちごとの変化
  const dailyFormula = () => {
    let array: number[] = [];
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
