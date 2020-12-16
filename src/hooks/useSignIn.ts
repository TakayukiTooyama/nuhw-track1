import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { auth, provider } from '../lib/firebase';
import { userAuthState } from '../recoil/users/user';

const useSignIn = () => {
  const [state, setState] = useState('vefore_sign_in');
  const [errors, setErrors] = useState(null);
  const [user, setUser] = useRecoilState(userAuthState);

  const signIn = useCallback(() => {
    if (user !== null) return;
    if (state === 'waiting_callback') {
      auth
        .getRedirectResult()
        .then((result) => {
          if (result.credential) {
            setState('loading');
            // setUser(result.user);
            setState('success');
          }
        })
        .catch((error) => {
          setState('error');
          setErrors(error.code);
        });
      setState('loading');
    } else {
      auth.signInWithRedirect(provider);
      setState('waiting_callback');
    }
  }, [user, setUser, state]);
  return [state, errors, signIn];
};
