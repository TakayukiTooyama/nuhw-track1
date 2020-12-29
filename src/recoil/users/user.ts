import { atom, selector } from 'recoil';
import { UserAuth, User, UserInfo, TournamentData } from '../../models/users';
import moment from 'moment';

//ユーザーデータを保持
export const userAuthState = atom<UserAuth | null>({
  key: 'userAuth',
  default: null,
});

export const userState = atom<User | null>({
  key: 'user',
  default: null,
});

//認証中のロード画面状況
export const loadingState = atom<boolean>({
  key: 'loading',
  default: false,
});

//今日の日付をフォーマット(例2020年12月1日 → 20201201)した形で保持
const today = new Date();
export const formatTodaysDateState = atom<number>({
  key: 'today',
  default: Number(moment(today).format('YYYYMMDD')),
});

//選択している日付を保持
export const selectedDateState = atom<Date>({
  key: 'date',
  default: new Date(),
});

//選択している日付をIDに変換
export const selectedDateIdState = selector<number>({
  key: 'dateId',
  get: ({ get }) => {
    const date = get(selectedDateState);
    return Number(moment(date).format('YYYYMMDD'));
  },
});

//追加したメニューの名前を保持 → 履歴と比較するため
export const addedMenuName = atom<string[]>({
  key: 'menuNames',
  default: [],
});

//データが保存されているか判別
export const toggleEditState = atom<boolean>({
  key: 'editToggle',
  default: false,
});

export const isComposedState = atom<boolean>({
  key: 'isComposed',
  default: false,
});

//選択しているメニューの名前
export const selectedMakedMenuNameState = atom<string>({
  key: 'selectedMenuName',
  default: '選択してください',
});

//作ったメニューの名前リスト(自分が行ったメニューとは関係のないものを排除するため)
export const makedMenuNameListState = atom<string[]>({
  key: 'menuNameList',
  default: [],
});

//表示するset数＆本数
export const NumberToDisplay = atom<string>({
  key: 'displayNumber',
  default: '5',
});

/*======tournament======*/
//選択している大会のIDを保持
export const selectedTournamentDataState = atom<TournamentData>({
  key: 'tournamentName',
  default: {
    id: '',
    name: '選択してください',
    venue: '',
    startDate: '',
    endDate: '',
  },
});

//選択しているmenuId
export const selectedMenuId = atom<string>({
  key: 'menuId',
  default: '',
});

//出場した大会のIDリストを保持
export const ParticipatedTournamentIds = atom<string[]>({
  key: 'tournamentIds',
  default: [],
});
