const useActiveElementScroll = () => {
  const current = document.activeElement;
  const scrollingElement = document.documentElement;
  return { current, scrollingElement };
};

export default useActiveElementScroll;
