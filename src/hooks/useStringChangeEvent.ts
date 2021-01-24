/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';

const useStringChangeEvent = (update: Dispatch<SetStateAction<string>>) =>
  useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      update(e.target.value);
    },
    [update]
  );

export default useStringChangeEvent;
