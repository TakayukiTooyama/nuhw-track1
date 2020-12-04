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
};

export type User = UserAuth & UserInfo;

export type TimeStamp = {
  created_at: TimeStamp;
  updated_at: TimeStamp;
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
  recodes: Recode[];
};

export type WeightName = {
  id: string;
  name: string;
};

//大会結果
type TournamentsRecode = {
  recode: string;
  round: '予選' | '準決勝' | '決勝';
  wind: number;
};

type Result = {
  event: string;
  recodes: TournamentsRecode[];
};

export type Tournaments = {
  date: Date;
  tournamentsName: string;
  place: string;
  results: Result[];
};
