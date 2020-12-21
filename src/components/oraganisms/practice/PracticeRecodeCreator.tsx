import { Button, HStack, Input } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { Menu, Recode } from '../../../models/users';
import { isComposedState, userAuthState } from '../../../recoil/users/user';

type Props = {
  index: number;
  recodes: Recode[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  toggleEdit: boolean;
  setToggleEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const PracticeRecodeCreator: FC<Props> = ({
  index,
  recodes,
  menuId,
  setIndex,
  setRecodes,
  toggleEdit,
  setToggleEdit,
}) => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const [isComposed, setIsComposed] = useRecoilState(isComposedState);

  //Local State
  const [recode, setRecode] = useState('');

  //編集を離れて場合 or 変更後の処理
  const handleBlur = () => {
    setToggleEdit(false);
    setRecode('');
  };

  //記録入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecode(e.target.value);
  };

  //新しく記録を追加するための処理
  const addRecode = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null) return;
    if (isComposed) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    if (e.key === 'Enter') {
      const newRecode = { recodeId: index, value: recode, editting: false };
      await practicesRef
        .update({ recodes: [...recodes, newRecode] })
        .then(() => {
          setRecodes((prev) => [...prev, newRecode]);
          setIndex(index + 1);
          setRecode('');
        });
    }
  };

  //入力モードへ切り替え & indexを戻す
  const InputToggle = () => {
    setIndex(recodes.length);
    setToggleEdit(true);
  };

  return (
    <HStack spacing={1} ml={14}>
      {toggleEdit ? (
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
        <Button w="200px" shadow="base" onClick={InputToggle}>
          ＋
        </Button>
      )}
    </HStack>
  );
};

export default PracticeRecodeCreator;
