import { Stat, StatArrow, StatLabel, StatNumber } from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  idx: number;
  type: 'increase' | 'decrease';
  data: number;
  label: string;
  format?: (input: string) => string;
};

const Statistics: FC<Props> = ({ idx, type, data, label, format }) => {
  const formatData = () => {
    if (format) {
      return format(String(data));
    } else {
      return data;
    }
  };

  return (
    <Stat>
      <StatLabel>{`${idx + 1}${label}`}</StatLabel>
      <StatNumber>
        <StatArrow type={type} />
        {formatData()}
      </StatNumber>
    </Stat>
  );
};

export default Statistics;
