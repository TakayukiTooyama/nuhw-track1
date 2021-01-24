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

const GraphMonthlyAverage: FC<Props> = ({ data, format, label }) => {
  const selectedName = useRecoilValue(selectedMakedMenuNameState);
  const [xLabel, setXLabel] = useState<string[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [dataList, setDataList] = useState<Data[]>([]);
  const [options, setOptions] = useState({});

  const january = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '01'
  );
  const february = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '02'
  );
  const march = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '03'
  );
  const april = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '04'
  );
  const may = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '05'
  );
  const june = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '06'
  );
  const july = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '07'
  );
  const august = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '08'
  );
  const september = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '09'
  );
  const october = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '10'
  );
  const november = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '11'
  );
  const december = data.filter(
    (item) => item.dateId.toString().substring(4, 6) === '12'
  );

  // xLabel作成 (例2020/12)
  useEffect(() => {
    setMonthlyData([]);
    if (january.length > 0) {
      monthlyAverageFormula(january);
      createXLabel('1月');
    }
    if (february.length > 0) {
      monthlyAverageFormula(february);
      createXLabel('2月');
    }
    if (march.length > 0) {
      monthlyAverageFormula(march);
      createXLabel('3月');
    }
    if (april.length > 0) {
      monthlyAverageFormula(april);
      createXLabel('4月');
    }
    if (may.length > 0) {
      monthlyAverageFormula(may);
      createXLabel('5月');
    }
    if (june.length > 0) {
      monthlyAverageFormula(june);
      createXLabel('6月');
    }
    if (july.length > 0) {
      monthlyAverageFormula(july);
      createXLabel('7月');
    }
    if (august.length > 0) {
      monthlyAverageFormula(august);
      createXLabel('8月');
    }
    if (september.length > 0) {
      monthlyAverageFormula(september);
      createXLabel('9月');
    }
    if (october.length > 0) {
      monthlyAverageFormula(october);
      createXLabel('10月');
    }
    if (november.length > 0) {
      monthlyAverageFormula(november);
      createXLabel('11月');
    }
    if (december.length > 0) {
      monthlyAverageFormula(december);
      createXLabel('12月');
    }
  }, [selectedName]);

  useEffect(() => {
    setDataList([{ name: `${label}`, data: monthlyData }]);
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
        text: '月間平均グラフ',
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

  // Xラベル作成 (例 1月)
  const createXLabel = (xLabel: string) => {
    setXLabel((prev) => [...prev, xLabel]);
  };

  // 月平均式
  const monthlyAverageFormula = (monthlyData: Menu[]) => {
    let sum = 0;
    const totalAry: string[] = [];
    monthlyData.forEach((data) => {
      data.recodes.forEach((recode) => {
        totalAry.push(recode.value);
        sum += Number(recode.value);
      });
    });
    const len = totalAry.length;
    const average = Math.floor(sum / len);
    setMonthlyData((prev) => [...prev, average]);
  };

  return <Chart options={options} series={dataList} type="line" height={300} />;
};

export default GraphMonthlyAverage;
