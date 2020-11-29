import { Practice, Tournaments, Weight } from './users';

//選択されている団体名のIDと名前
export type TeamInfo = Pick<Team, 'teamId' | 'teamName'>;

//団体の全てのデータ
export type Team = {
  teamId: string;
  teamName: string;
  password: string;
};

//チームの練習記録
export type TeamPractice = Practice & {
  group: string;
};

//チームのウエイト記録
export type TeamWeight = Weight & {
  group: string;
};

//チームの大会結果
export type TeamTournamentsResult = Tournaments & {
  group: string;
};