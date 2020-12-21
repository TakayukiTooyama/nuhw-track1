import React, { VFC } from 'react';
import {
  GraphAllData,
  GraphDailyAverage,
  GraphMonthlyAverage,
  TableView,
} from '..';
import { Menu } from '../../../models/users';

type Props = {
  data: Menu[];
  dateNumber: number;
  axisLabel: string;
  firstHeaderLabel?: string;
  label: string;
  format: (input: string) => string;
};

const PracticeMonthlyData: VFC<Props> = ({
  data,
  dateNumber,
  axisLabel,
  firstHeaderLabel,
  label,
  format,
}) => {
  return (
    <>
      <GraphAllData
        data={data}
        format={format}
        label={label}
        axisLabel={axisLabel}
      />
      {dateNumber >= 6 && (
        <>
          <GraphDailyAverage
            data={data}
            format={format}
            label={`平均${label}`}
          />
          <GraphMonthlyAverage
            data={data}
            format={format}
            label={`平均${label}`}
          />
        </>
      )}
      <TableView
        menus={data}
        label={label === 'タイム' ? '本目' : 'セット'}
        firstHeaderLabel={firstHeaderLabel}
        format={format}
      />
    </>
  );
};

export default PracticeMonthlyData;
