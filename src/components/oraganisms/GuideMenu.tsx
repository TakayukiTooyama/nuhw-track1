import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import Router from 'next/router';
import React, { FC } from 'react';
import {
  AiOutlineSetting,
  AiOutlineRead,
  AiOutlineHome,
  AiOutlineLogout,
} from 'react-icons/ai';
import { auth } from '../../lib/firebase';

type Props = {
  avatar: string;
};

const GuideMenu: FC<Props> = ({ avatar }) => {
  const goToLink = (link: string) => {
    Router.push(link);
  };

  const logout = async () => {
    await auth.signOut().then(() => {
      Router.push('/signin');
    });
  };

  return (
    <Menu>
      <MenuButton>
        <Avatar src={avatar} shadow="lg" />
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
          onClick={() => goToLink('/browsing')}
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
