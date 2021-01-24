import { Button, HStack, Text } from '@chakra-ui/react';
import ja from 'date-fns/locale/ja';
import moment from 'moment';
import React, { FC } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

registerLocale('ja', ja);

type Props = {
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
};

const DateRangePicker: FC<Props> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  // フォーマット変更 → 2020/12/26
  const getFormatDate = (date: Date) => moment(date).format('YYYY/MM/DD');

  return (
    <HStack spacing={2}>
      <ReactDatePicker
        locale="ja"
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        customInput={
          <Button shadow="base" color="gray.600">
            {getFormatDate(startDate)}
          </Button>
        }
      />
      <Text fontSize="xl" color="gray.600">
        〜
      </Text>
      <ReactDatePicker
        locale="ja"
        selected={endDate}
        onChange={(date: Date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        customInput={
          <Button shadow="base" color="gray.600">
            {getFormatDate(endDate)}
          </Button>
        }
      />
    </HStack>
  );
};

export default DateRangePicker;
