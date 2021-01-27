// 入力時の表記をタイム表記に変換
export const formatTimeNotationAtInput = (input: string): string => {
  const len = input.length;
  if (len > 2 && len < 5)
    return `${input.slice(0, len - 2)}"${input.slice(len - 2, len)}`;
  if (len > 4 && len < 7)
    return `${input.slice(0, len - 4)}'${input.slice(
      len - 4,
      len - 2
    )}"${input.slice(len - 2, len)}`;
  return input;
};
