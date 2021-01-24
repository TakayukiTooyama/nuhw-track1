import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import Router from 'next/router';
import React, { useState, VFC } from 'react';
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineRead,
  AiOutlineSetting,
} from 'react-icons/ai';

import { auth } from '../../../lib/firebase';

const GuideMenu: VFC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const goToLink = (link: string) => {
    Router.push(link);
  };

  const logout = async () => {
    await auth.signOut().then(() => {
      Router.push('/signin');
    });
  };

  return (
    <Menu
      onOpen={() => setToggleMenu(true)}
      onClose={() => setToggleMenu(false)}
    >
      <MenuButton>
        {toggleMenu ? (
          <CloseIcon fontSize="18px" />
        ) : (
          <HamburgerIcon fontSize="25px" />
        )}
      </MenuButton>
      <MenuList color="grey">
        <MenuItem
          icon={<AiOutlineHome fontSize="20px" />}
          onClick={() => goToLink('/')}
        >
          ホーム
        </MenuItem>
        <MenuItem
          icon={<AiOutlineRead fontSize="20px" />}
          onClick={() => goToLink('/view')}
        >
          閲覧
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<AiOutlineSetting fontSize="20px" />}
          onClick={() => goToLink('/mypage')}
        >
          プロフィール設定
        </MenuItem>
        <MenuItem icon={<AiOutlineLogout fontSize="20px" />} onClick={logout}>
          ログアウト
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default GuideMenu;
