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
  teamName: string,
  userAuth: UserAuth | null,
  setSubmitting: (isSubmitting: boolean) => void,
  setSubmitErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (userAuth === null) return;
  setSubmitErrorMessage('');

  await teamsRef
    .where('teamName', '==', teamName)
    .where('password', '==', password)
    .get()
    .then(async (snapshot) => {
      const teamInfo = snapshot.docs.map((doc) => {
        const data = doc.data() as Team;
        return data;
      });
      await usersRef
        .doc(userAuth.uid)
        .update({
          teamInfo: {
            teamId: teamInfo[0].teamId,
            teamName: teamInfo[0].teamName,
          },
        })
        .then(() => {
          Router.push('/teams/profile');
        });
    })
    .catch(() => {
      setSubmitting(false);
      setSubmitErrorMessage('パスワードもしくはチーム名が間違っています');
    });
};
