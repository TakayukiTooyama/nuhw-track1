import { Tab, TabList as List } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  tabList: string[];
};

const TabList: VFC<Props> = ({ tabList }) => (
    <List>
      {tabList.map((item) => (
        <Tab key={item}>{item}</Tab>
      ))}
    </List>
  );

export default TabList;
