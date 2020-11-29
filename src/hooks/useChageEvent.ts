import React, { useCallback } from 'react';

export const useStringChangeEvent = (
  update: React.Dispatch<React.SetStateAction<string>>
) => {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      update(e.target.value);
    },
    [update]
  );
};
