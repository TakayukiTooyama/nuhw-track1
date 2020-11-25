import { Button } from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  logout: () => void;
};

const SignOut: FC<Props> = ({ logout = () => undefined }) => {
  return (
    <div>
      <Button onClick={logout}>ログアウト</Button>
    </div>
  );
};

export default SignOut;
