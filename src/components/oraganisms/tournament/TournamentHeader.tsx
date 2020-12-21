import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import moment from 'moment';

import { selectedTournamentDataState } from '../../../recoil/users/user';
import { SelectMenu } from '../../molecules';
import { TournamentData } from '../../../models/users';

type Props = {
  dataList: TournamentData[];
};

const TournamentHeader: FC<Props> = ({ dataList }) => {
  const selectedData = useRecoilValue(selectedTournamentDataState);
  const format = (date: Date | string, format: string) => {
    return moment(date).format(format);
  };
  //開催日
  const formatStartDate = format(selectedData.startDate, 'YYYY/MM/DD');
  //最終日
  const formatEndDate = format(selectedData.endDate, 'MM/DD');

  return (
    <>
      <SelectMenu dataList={dataList} name={selectedData.name} />
      <Flex
        justify={['none', 'space-between']}
        flexDir={['column', 'row']}
        align="center"
        px={2}
        py={1}
        color="gray.400"
      >
        <Text variant="sub">
          {selectedData.startDate !== ''
            ? `${formatStartDate} 〜 ${formatEndDate}`
            : null}
        </Text>
        <Text variant="sub">{selectedData.venue}</Text>
      </Flex>
      <Box mb={4}></Box>
    </>
  );
};

export default TournamentHeader;
