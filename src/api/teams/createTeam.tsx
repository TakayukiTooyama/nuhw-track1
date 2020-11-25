import Router from 'next/router';
import { useRecoilValue } from 'recoil';
import { db, FirebaseTimestamp } from '../../lib/firebase';
import { userAuthState } from '../../recoil/user';

const createTeam = async (teamName: string, password: string): Promise<any> => {
  const user = useRecoilValue(userAuthState);
  const teamsRef = db.collection('teams');
  const id = teamsRef.doc().id;
  const newData = {
    teamId: id,
    teamName,
    password,
    menbers: [user?.uid],
    created_at: FirebaseTimestamp,
  };
  await teamsRef
    .doc(id)
    .set(newData)
    .then(() => {
      Router.push('/teams/profile');
    });
};

export default createTeam;
