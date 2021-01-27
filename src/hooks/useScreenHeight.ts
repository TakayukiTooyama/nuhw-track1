import { useEffect, useState } from 'react';

const useScreenHeight = () => {
  const [screenHeight, setScreenHeight] = useState(568);

  useEffect(() => {
    const screenHeight = window.innerHeight;
    setScreenHeight(screenHeight);
  }, []);

  return { screenHeight };
};

export default useScreenHeight;
