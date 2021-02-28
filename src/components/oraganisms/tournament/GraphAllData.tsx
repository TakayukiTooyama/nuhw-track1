import moment from 'moment';
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { TournamentMenu } from '../../../models/users';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  data: TournamentMenu[];
  label: string;
};
type Data = {
  name: string;
  data: number[];
};

const GraphAllData: FC<Props> = ({ data, label }) => {
  // Global State
  const selectedName = useRecoilValue(selectedMakedMenuNameState);

  // Local State
  const [xLabel, setXLabel] = useState<string[]>([]);
  const [dataList, setDataList] = useState<Data[]>([]);
  const [options, setOptions] = useState({});

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
        size: 1,
      },
      title: {
        text: '全ての記録',
        align: 'left',
      },
      xaxis: {
        categories: xLabel,
        labels: {
          show: false,
        },
      },
      yaxis: {
        formatter(val: number) {
          return val;
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter(val: number) {
            return val;
          },
        },
      },
    });
  }, [xLabel]);

  const createXLabel = () => {
    const xLabelAry: string[] = [];
    data.forEach((item) => {
      const date = moment(String(item.competitionDay)).format('YYYY/MM/DD');
      item.records?.forEach((record) => {
        xLabelAry.push(
          `${item.data.name} ・ ${date} ・ ${record.round} ・ 風${record.wind}`
        );
      });
    });
    setXLabel(xLabelAry);
  };

  // 日にちごとの変化
  const dailyFormula = () => {
    const array: number[] = [];
    data.forEach((menu) => {
      menu.records?.forEach((record) => {
        const { value } = record;
        if (value.length > 4) {
          const data = `${String(
            Number(value.slice(0, 1)) * 60 + Number(value.slice(1, 3))
          )}.${value.slice(3)}`;
          array.push(Number(data));
        } else {
          const data = Number(`${value.slice(0, -2)}.${value.slice(-2)}`);
          array.push(Number(data));
        }
      });
    });
    setDataList([{ name: label, data: array }]);
  };

  return <Chart options={options} series={dataList} type="line" height={300} />;
};

export default GraphAllData;
