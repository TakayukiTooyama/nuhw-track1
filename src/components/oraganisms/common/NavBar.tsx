import { Box } from '@chakra-ui/react';
import React, { VFC } from 'react';
import { AiOutlineHome, AiOutlineRead, AiOutlineSetting } from 'react-icons/ai';
import { NavTab } from '../../molecules';

const navList = [
  { name: 'ホーム', icon: AiOutlineHome, link: `/` },
  { name: '閲覧', icon: AiOutlineRead, link: `/view` },
  { name: '設定', icon: AiOutlineSetting, link: `/mypage` },
];

const NavBar: VFC = () => {
  return (
    <>
      <Box
        pos="fixed"
        bottom="0"
        w="100%"
        h="40px"
        alignItems="center"
        textAlign="center"
        display={['flex', 'none']}
        borderTop="1px solid"
        borderColor="gray.100"
      >
        {navList.map((item) => (
          <NavTab
            key={item.name}
            name={item.name}
            icon={item.icon}
            link={item.link}
          />
        ))}
      </Box>
    </>
  );
};

export default NavBar;
