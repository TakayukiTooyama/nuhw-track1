import { Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedDateIdState, selectedDateState } from '../../recoil/user';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { addDays } from 'date-fns';
import Router from 'next/router';

registerLocale('ja', ja);

const DatePicker = () => {
  const [date, setDate] = useRecoilState(selectedDateState);
  const dateId = useRecoilValue(selectedDateIdState);

  useEffect(() => {
    Router.push(`${dateId}`);
  }, [date]);

  //datepickerの変更
  const dateSet = (date: Date | null) => {
    if (date === null) return;
    setDate(date);
  };

  //フォーマット変更 → 2020/12/26
  const getFormatDate = (date: Date | null) => {
    if (date === null || date === undefined) return;
    return (
      date.getFullYear() +
      ' / ' +
      (date.getMonth() + 1) +
      ' / ' +
      date.getDate()
    );
  };

  return (
    <ReactDatePicker
      locale="ja"
      selected={date}
      onChange={(date: Date | null) => dateSet(date)}
      maxDate={addDays(new Date(), 0)}
      customInput={
        <Button shadow="base" bg="orange.400">
          {getFormatDate(date)}
        </Button>
      }
    />
  );
};

export default DatePicker;
