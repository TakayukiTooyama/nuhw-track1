import { Box, Button, Icon, Stack, Text } from '@chakra-ui/react';
import ja from 'date-fns/locale/ja';
import moment from 'moment';
import React, { FC } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { FcCalendar } from 'react-icons/fc';

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
  const formatDate = (date: Date) => moment(date).format('YYYY/MM/DD');

  return (
    <Stack direction={['column', 'row']} spacing={2}>
      <Box>
        <Text ml={2}>開催日</Text>
        <ReactDatePicker
          locale="ja"
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          customInput={
            <Button
              bg="gray.100"
              border="2px solid"
              borderColor="gray.300"
              borderRadius="30px"
              iconSpacing={4}
              rightIcon={<Icon as={FcCalendar} w={6} h={6} />}
            >
              {formatDate(startDate)}
            </Button>
          }
        />
      </Box>
      <Box>
        <Text ml={2}>終了日</Text>
        <ReactDatePicker
          locale="ja"
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          customInput={
            <Button
              w="100%"
              bg="gray.100"
              border="2px solid"
              borderColor="gray.300"
              borderRadius="30px"
              iconSpacing={4}
              rightIcon={<Icon as={FcCalendar} w={6} h={6} />}
            >
              {formatDate(endDate)}
            </Button>
          }
        />
      </Box>
    </Stack>
  );
};

export default DateRangePicker;
