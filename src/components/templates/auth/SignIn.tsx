import { Flex, Progress } from '@chakra-ui/react';
import React, { useEffect, VFC } from 'react';
import { useRecoilState } from 'recoil';

import { useAuthentication } from '../../../hooks';
import { auth } from '../../../lib/firebase';
import {
  navigationAfterAuth,
  screenTransition,
} from '../../../lib/firestore/users';
import { loadingState } from '../../../recoil/users/user';
import { SignInBottom, SignInTop } from '../../oraganisms';

const SignIn: VFC = () => {
  const [loading, setLoading] = useRecoilState(loadingState);

  const { userAuth } = useAuthentication();

  // Google認証中と認証結果による画面遷移
  useEffect(() => {
    auth.getRedirectResult().then((result) => {
      if (result.user || auth.currentUser) {
        if (result.user !== null) {
          navigationAfterAuth({
            uid: result.user.uid,
            photoURL: result.user.photoURL ?? '',
            displayName: result.user.displayName ?? '',
          });
        }
      } else {
        setLoading(true);
      }
    });
  }, [userAuth, setLoading]);

  /*
    チーム情報やプロフィール情報を入力したのにもかかわらず、
    誤ってSignIn画面戻ってきてしまった場合
  */
  useEffect(() => {
    if (userAuth !== null) {
      screenTransition(userAuth);
    }
  }, [userAuth]);

  return (
    <>
      {loading ? (
        <Flex direction={{ base: 'column', md: 'row' }}>
          <SignInTop />
          <SignInBottom />
        </Flex>
      ) : (
        <Progress size="xs" isIndeterminate />
      )}
    </>
  );
};

export default SignIn;
