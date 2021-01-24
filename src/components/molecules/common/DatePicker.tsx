import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '@chakra-ui/react';
import { addDays } from 'date-fns';
import ja from 'date-fns/locale/ja';
import moment from 'moment';
import Router from 'next/router';
import React, { FC, useEffect } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  selectedDateIdState,
  selectedDateState,
} from '../../../recoil/users/user';

registerLocale('ja', ja);

type Props = {
  bg: string;
};

const DatePicker: FC<Props> = ({ bg }) => {
  const [date, setDate] = useRecoilState(selectedDateState);
  const dateId = useRecoilValue(selectedDateIdState);

  useEffect(() => {
    Router.push(`${dateId}`);
  }, [date]);

  // フォーマット変更 → 2020/12/26
  const getFormatDate = (date: Date) => moment(date).format('YYYY / MM / DD');

  return (
    <ReactDatePicker
      locale="ja"
      selected={date}
      onChange={(date: Date) => setDate(date)}
      maxDate={addDays(new Date(), 0)}
      customInput={
        <Button shadow="base" color="black" bg={bg}>
          {getFormatDate(date)}
        </Button>
      }
    />
  );
};

export default DatePicker;
