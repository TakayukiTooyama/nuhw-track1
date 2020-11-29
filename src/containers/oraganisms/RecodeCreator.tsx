import { Button, HStack, Input } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../../lib/firebase';
import { Menu, Recode } from '../../models/users';
import { userAuthState } from '../../recoil/user';

type Props = {
  name: string;
  recodes: Recode[];
  items: Menu;
  index: number;
  menus: Menu[];
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  saveToggle: boolean;
  setSaveToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const RecodeCreator: FC<Props> = ({
  index,
  menus,
  name,
  recodes,
  items,
  setIndex,
  setRecodes,
  setMenus,
  saveToggle,
  setSaveToggle,
}) => {
  const user = useRecoilValue(userAuthState);
  const [recode, setRecode] = useState(''),
    [toggle, setToggle] = useState(false),
    [isLoading, setIsLoading] = useState(false),
    [isComposed, setIsComposed] = useState(false);

  //編集を離れて場合 or 変更後の処理
  const handleBlur = () => {
    setToggle(false);
    setRecode('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecode(e.target.value);
  };

  //新しく記録を追加するための処理
  const addRecode = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isComposed) return;
    if (recode === '') return;
    if (e.key === 'Enter') {
      const newRecode = { recodeId: index, value: recode, editting: false };
      setRecodes((prev) => [...prev, newRecode]);
      setSaveToggle(false);
      setIndex(index + 1);
      setRecode('');
    }
  };

  //編集したメニューを保存する
  const saveMenus = async () => {
    if (user === null || user === undefined) return;
    setIsLoading(true);
    const newMenus = {
      dateId: items.dateId,
      menuId: items.menuId,
      name,
      recodes,
    };
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(items.menuId);
    await practicesRef.update(newMenus).then(() => {
      const idx = menus.findIndex((menu) => {
        menu.menuId === items.menuId;
      });
      menus[idx] = newMenus;
      setMenus(menus);
      setSaveToggle(true);
      setIsLoading(false);
    });
  };

  //入力モードへ切り替え & indexを戻す
  const InputToggle = () => {
    setIndex(recodes.length);
    setToggle(true);
  };

  return (
    <HStack spacing={1} ml={14}>
      {toggle ? (
        <Input
          autoFocus
          maxW="200px"
          value={recode}
          placeholder={`${index + 1}本目`}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={addRecode}
          onCompositionStart={() => setIsComposed(true)}
          onCompositionEnd={() => setIsComposed(false)}
        />
      ) : (
        <>
          <Button w="98px" onClick={InputToggle}>
            ＋
          </Button>
          {saveToggle ? null : (
            <Button
              w="98px"
              bg="orange.400"
              color="white"
              isLoading={isLoading}
              onClick={saveMenus}
            >
              保存
            </Button>
          )}
        </>
      )}
    </HStack>
  );
};

export default RecodeCreator;
