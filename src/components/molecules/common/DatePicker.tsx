import 'react-datepicker/dist/react-datepicker.css';

import { Button, Icon } from '@chakra-ui/react';
import { addDays } from 'date-fns';
import ja from 'date-fns/locale/ja';
import moment from 'moment';
import Router from 'next/router';
import React, { useEffect, VFC } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FcCalendar } from 'react-icons/fc';

import {
  selectedDateIdState,
  selectedDateState,
} from '../../../recoil/users/user';

registerLocale('ja', ja);

const DatePicker: VFC = () => {
  const [date, setDate] = useRecoilState(selectedDateState);
  const dateId = useRecoilValue(selectedDateIdState);

  useEffect(() => {
    Router.push(`${dateId}`);
  }, [date]);

  // フォーマット変更 → 2020/12/26
  const formatDate = (date: Date) => moment(date).format('YYYY / MM / DD');

  return (
    <ReactDatePicker
      locale="ja"
      selected={date}
      onChange={(date: Date) => setDate(date)}
      maxDate={addDays(new Date(), 0)}
      customInput={
        <Button
          bg="gray.100"
          border="2px solid"
          borderColor="gray.300"
          borderRadius="30px"
          iconSpacing={4}
          rightIcon={<Icon as={FcCalendar} w={6} h={6} />}
        >
          {formatDate(date)}
        </Button>
      }
    />
  );
};

export default DatePicker;
