import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button } from '@chakra-ui/react';
import React, { VFC } from 'react';

const TournamentTableMenu: VFC = () => {
  return (
    // <Box display={['none', 'flex']} justifyContent="space-between">
    //   <Button
    //     leftIcon={hide ? <ViewOffIcon /> : <ViewIcon />}
    //     {...boxStyle}
    //     onClick={() => setHide((prev) => !prev)}
    //   >
    //     日付・学年
    //   </Button>
    //   <Button
    //     leftIcon={toggleSearch ? <ViewIcon /> : <ViewOffIcon />}
    //     {...boxStyle}
    //     onClick={() => setToggleSearch((prev) => !prev)}
    //   >
    //     絞り込み
    //   </Button>
    //   <Button
    //     leftIcon={toggleOfficial ? <ViewIcon /> : <ViewOffIcon />}
    //     {...boxStyle}
    //     onClick={() => setToggleOfficial((prev) => !prev)}
    //   >
    //     公式タイム
    //   </Button>
    // </Box>
  );
};

export default TournamentTableMenu;
