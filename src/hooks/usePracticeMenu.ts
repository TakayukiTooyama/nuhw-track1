import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../lib/firebase';
import { Menu } from '../models/users';
import {
  isComposedState,
  selectedDateIdState,
  userState,
} from '../recoil/users/user';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const usePracticeMenu = (menusData: Menu[]) => {
  // Global State
  const user = useRecoilValue(userState);
  const dateId = useRecoilValue(selectedDateIdState);
  const isComposed = useRecoilValue(isComposedState);

  // Local State
  const [menus, setMenus] = useState<Menu[]>(menusData);
  const [name, setName] = useState('');
  const [toggleMenu, setToggleMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // メニュー追加処理
  const addMenu = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (isComposed) return;
    if (name === '') {
      setErrorMessage('練習メニューを登録してください');
      return;
    }
    if (
      name !== '10' &&
      name !== '30' &&
      name !== '50' &&
      name !== '60' &&
      name !== '80' &&
      name !== '100' &&
      name !== '120' &&
      name !== '150' &&
      name !== '200' &&
      name !== '250' &&
      name !== '300' &&
      name !== '350' &&
      name !== '400' &&
      name !== '500' &&
      name !== '600' &&
      name !== '800'
    ) {
      setErrorMessage('いつもの練習距離でなければ登録できません。');
      return;
    }
    if (e.key === 'Enter') {
      if (user === null) return;
      const practicesRef = db
        .collection('users')
        .doc(user.uid)
        .collection('practices');
      const menuId = practicesRef.doc().id;
      const newData = { dateId, menuId, name: `${name}M`, records: [] };
      await practicesRef
        .doc(menuId)
        .set(newData)
        .then(() => {
          setMenus((prev) => [...prev, newData]);
          setToggleMenu(false);
          setName('');
        });
    }
  };

  // メニュー削除処理
  const deleteMenu = async (menuId: string) => {
    if (user === null) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    await practicesRef.delete().then(() => {
      const newMenus = menus.filter((menu) => menu.menuId !== menuId);
      setMenus(newMenus);
    });
  };

  // メニューの名前入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // 入力処理を離れる時の処理
  const handleBlur = () => {
    setToggleMenu(false);
    setName('');
    setErrorMessage('');
  };
  return {
    menus,
    setMenus,
    name,
    addMenu,
    deleteMenu,
    handleChange,
    handleBlur,
    setToggleMenu,
    toggleMenu,
    setErrorMessage,
    errorMessage,
  };
};

export default usePracticeMenu;
