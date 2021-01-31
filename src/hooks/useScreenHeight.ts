import { useEffect, useState } from 'react';

const useScreenHeight = () => {
  const [screenHeight, setScreenHeight] = useState(568);

  useEffect(() => {
    const screenHeight = window.innerHeight;
    setScreenHeight(screenHeight);
  }, [window.innerHeight]);

  return { screenHeight };
};

export default useScreenHeight;
