import { atom } from 'recoil';
import { TeamInfo } from '../models/teams';

//選択している団体のIDと名前
export const selectedTeamInfo = atom<TeamInfo | null>({
  key: 'teamIdName',
  default: null,
});
