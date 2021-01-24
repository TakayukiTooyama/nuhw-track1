// 後々追加する可能性があるのでEslintをOffにしておく
/* eslint-disable import/prefer-default-export */
import { atom } from 'recoil';

import { TeamInfo } from '../../models/teams';

// 選択している団体のIDと名前
export const selectedTeamInfo = atom<TeamInfo | null>({
  key: 'teamIdName',
  default: null,
});
