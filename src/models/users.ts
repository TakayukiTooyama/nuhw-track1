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

export type TimeStamp = {
  created_at: TimeStamp;
  updated_at: TimeStamp;
};

//ウエイト
export type TrainingMenu = {
  title: string;
};

type WeightMenu = {
  weightName: string;
  rm: number;
  recodes: number[];
};

export type Weight = {
  date: Date;
  menus: WeightMenu[];
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
