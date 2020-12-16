import { TeamInfo } from './teams';

//ユーザー情報
export type UserAuth = {
  uid: string;
  photoURL?: string;
  displayName: string;
};

export type UserInfo = {
  blockName: string;
  gender: string;
  grade: string;
  teamInfo: TeamInfo;
  tournamentIds: string[];
};

export type User = UserAuth & UserInfo;

export type TimeStamp = {
  created_at: TimeStamp;
  updated_at: TimeStamp;
};

//選択しているnameListの型
export type SelectNameList = {
  id: string;
  name: string;
};

//練習メニュー
export type Recode = {
  recodeId: number;
  value: string;
  editting: boolean;
};

export type Menu = {
  dateId: number;
  menuId: string;
  name: string;
  recodes: Recode[];
};

//ウエイト
export type WeightMenu = {
  dateId: number;
  menuId: string;
  name: string;
  rm: number;
  setCount: number;
  recodes: Recode[];
};

export type WeightName = {
  id: string;
  name: string;
};

//大会結果
export type Round = '予選' | '準決勝' | '決勝';

export type TournamentRecode = {
  recodeId: number;
  value: string;
  round: Round;
  wind: string;
  lane: string;
};

export type TournamentMenu = {
  menuId: string;
  competitionName: string;
  competitionDay: number;
  data: TournamentData;
  recodes: TournamentRecode[];
};

export type TournamentData = {
  id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
};
