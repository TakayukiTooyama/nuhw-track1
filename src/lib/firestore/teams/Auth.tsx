/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */
import Router from 'next/router';

import { Team } from '../../../models/teams';
import { UserAuth } from '../../../models/users';
import { db } from '../../firebase';

const teamsRef = db.collection('teams');
const usersRef = db.collection('users');

// 団体参加処理(パスワード検証)
export const userJoinToTeam = async (
  password: string,
  userAuth: UserAuth | null,
  setSubmitting: (isSubmitting: boolean) => void,
  setSubmitErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (userAuth === null) return;
  setSubmitErrorMessage('');

  await teamsRef
    .doc('e2ZQAbPvnqMvTFUktAGC')
    .get()
    .then(async (doc) => {
      const data = doc.data() as Team;
      const { teamId } = data;

      if (data.password === password) {
        await usersRef
          .doc(userAuth.uid)
          .update({ teamInfo: { teamId, teamName: '新潟医療福祉大学' } })
          .then(() => {
            Router.push('/teams/profile');
          });
      } else {
        setSubmitting(false);
        setSubmitErrorMessage('パスワードが間違っています');
      }
    });
};
