//共通
export { default as Header } from './common/Header';
export { default as Home } from './common/Home';
export { default as Layout } from './common/Layout';
export { default as ProfileDetail } from './common/ProfileDetail';
export { default as ProfileEdit } from './common/ProfileEdit';

//認証
export { default as SignIn } from './auth/SignIn';
export { default as TeamCreate } from './auth/TeamCreate';
export { default as TeamJoin } from './auth/TeamJoin';
export { default as ProfileCreate } from './auth/ProfileCreate';

//練習タイム
export { default as PracticeViewDetail } from './practice/PracticeViewDetail';
export { default as PracticeEditDetail } from './practice/PracticeEditDetail';

//ウエイト
export { default as WeightEditDetail } from './weight/WeightEditDetail';
export { default as WeightViewDetail } from './weight/WeightViewDetail';
export { default as CreateWeightMenuDetail } from './weight/CreateWeightMenuDetail';

//大会結果
export { default as CreateTournamentMenuDetail } from './tournament/CreateTournamentMenuDetail';
export { default as TournamentEditDetail } from './tournament/TournamentEditDetail';
export { default as TournamentViewDetail } from './tournament/TournamentViewDetail';
export { default as TournamentFirstViewDetail } from './tournament/TournamentFirstViewDetail';

//記録閲覧
export { default as ViewDetail } from './view/ViewDetail';
export { default as ViewDetailTournament } from './view/ViewDetailTournament';
export { default as ViewDetailWeight } from './view/ViewDetailWeight';
export { default as WeightViewTable } from './view/WeightViewTable';
export { default as TournamentViewTable } from './view/TournamentViewTable';
