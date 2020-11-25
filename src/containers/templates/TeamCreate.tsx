import React, { useState } from 'react';
import Router from 'next/router';
import { useSetRecoilState } from 'recoil';

import { db } from '../../lib/firebase';
import { Team } from '../../models/teams';
import TeamCreate from '../../components/templates/TeamCreate';
import { selectedTeamInfo } from '../../recoil/team';

const EnhancedTeamCreate = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const setSelectedTeamInfo = useSetRecoilState(selectedTeamInfo);

  const createTeam = async (
    teamName: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const teamsRef = db.collection('teams');
    const id = teamsRef.doc().id;
    const newData: Team = {
      teamId: id,
      teamName: teamName,
      password: password,
    };
    await teamsRef.get().then((snapshot) => {
      //すでに作成されているデータの数
      let dbLength = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Team;

        //すでに使われている団体名
        const usedTemaName = data.teamName;

        if (usedTemaName === teamName) {
          setSubmitting(false);
          setSubmitErrorMessage('すでに使われている団体名です。');
        } else {
          dbLength.push(data);
        }
      });
      //まだ入力した団体名が使われていない場合
      if (dbLength.length === snapshot.docs.length) {
        teamsRef
          .doc(id)
          .set(newData)
          //↑ここでエラーが起きてる おそらくupdateができないのに何でしてるの？だと思う
          .then(() => {
            setSelectedTeamInfo({ teamId: id, teamName });
            Router.push('/teams/profile');
          });
      }
    });
  };
  return (
    <TeamCreate
      createTeam={createTeam}
      submitErrorMessage={submitErrorMessage}
      setSubmitErrorMessage={setSubmitErrorMessage}
    />
  );
};

export default EnhancedTeamCreate;
