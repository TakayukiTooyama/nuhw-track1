import { atom, selector } from 'recoil';
import { UserAuth, User, UserInfo } from '../models/users';

//ユーザーデータを保持
export const userAuthState = atom<
  firebase.default.User | UserAuth | null | undefined
>({
  key: 'userAuth',
  default: undefined,
});

export const userInfoState = atom<UserInfo | null>({
  key: 'userInfo',
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

//選択している日付を保持
export const selectedDateState = atom<Date | null>({
  key: 'date',
  default: new Date(),
});

//選択している日付をIDに変換
export const selectedDateIdState = selector<number>({
  key: 'dateId',
  get: ({ get }) => {
    const date = get(selectedDateState);
    return Number(
      date?.getFullYear() +
        ('00' + (date?.getMonth()! + 1)).slice(2) +
        ('00' + date?.getDate()).slice(2)
    );
  },
});

//追加したメニューの名前を保持 → 履歴と比較するため
export const addedMenuName = atom<string[]>({
  key: 'menuNames',
  default: [],
});
