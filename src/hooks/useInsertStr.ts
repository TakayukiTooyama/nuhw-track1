//最初に0が着いていたら削除
const replaceZero = (input: string) => {
  const firstIndex = input.slice(0, 1);
  if (firstIndex === '0') {
    return firstIndex.replace('0', '') + input.slice(1, input.length);
  }
  return input;
};

//入力された文字列をタイム表記に変換
export const insertStr = (input: string) => {
  const len = input.length;
  if (len > 2 && len < 5)
    return replaceZero(
      input.slice(0, len - 2) + '"' + input.slice(len - 2, len)
    );
  if (len > 4 && len < 7)
    return replaceZero(
      input.slice(0, len - 4) +
        "'" +
        input.slice(len - 4, len - 2) +
        '"' +
        input.slice(len - 2, len)
    );
  if (len > 6 && len < 9)
    return replaceZero(
      input.slice(0, len - 6) +
        ':' +
        input.slice(len - 6, len - 4) +
        "'" +
        input.slice(len - 4, len - 2) +
        '"' +
        input.slice(len - 2, len)
    );
  return replaceZero(input);
};
