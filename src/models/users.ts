import { ReactElement } from 'react';

import type { TeamInfo } from './teams';

// ユーザーの認証情報
export type UserAuth = {
  uid: string;
  photoURL?: string;
  displayName: string;
};

// ユーザーの詳細情報
export type UserInfo = {
  blockName: string;
  gender: string;
  grade: string;
  teamInfo: TeamInfo;
  tournamentIds: string[];
};

// ユーザーの認証と詳細情報
export type User = UserAuth & UserInfo;

// ユーザープロフィール
export type Profile = {
  blockName: string;
  grade: string;
  gender: string;
};

// タイムスタンプ
export type TimeStamp = {
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
};

export type LinkContent = {
  id: string;
  name: string;
  color?: string;
  icon?: ReactElement;
  link: string | number;
  image?: string;
};

// 選択しているnameListの型
export type SelectNameList = {
  id: string;
  name: string;
};

// 前回の記録との比較
export type Comparison = {
  type: 'increase' | 'decrease';
  data: number;
};

// 練習メニュー
export type Record = {
  recodeId: number;
  value: string;
  editting: boolean;
};

export type Menu = {
  dateId: number;
  menuId: string;
  name: string;
  recodes: Record[];
};

// ウエイト
export type WeightMenu = {
  dateId: number;
  menuId: string;
  name: string;
  rm: number;
  setCount: number;
  recodes: Record[];
};

export type WeightName = {
  id: string;
  name: string;
};

// 大会結果
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

// 閲覧ページ
export type SearchName = {
  id: string;
  name: string;
};
