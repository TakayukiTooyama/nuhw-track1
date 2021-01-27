import { useEffect, useState } from 'react';

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<'Mobile' | 'Desktop'>('Mobile');

  useEffect(() => {
    if (
      navigator.userAgent.indexOf('iPhone') > 0 ||
      navigator.userAgent.indexOf('iPad') > 0 ||
      navigator.userAgent.indexOf('iPod') > 0 ||
      navigator.userAgent.indexOf('Android') > 0
    ) {
      setDeviceInfo('Mobile');
    } else {
      setDeviceInfo('Desktop');
    }
  }, []);

  return { deviceInfo };
};

export default useDeviceInfo;
