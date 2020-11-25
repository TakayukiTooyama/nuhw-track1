import React, { useState } from 'react';
import Router from 'next/router';
import { useSetRecoilState } from 'recoil';

import { db } from '../../lib/firebase';
import { Team } from '../../models/teams';
import { TeamJoin } from '../../components/templates';
import { selectedTeamInfo } from '../../recoil/team';

const EnhancedTeamJoin = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const setSelectedTeamInfo = useSetRecoilState(selectedTeamInfo);

  const userJoinToTeam = async (
    teamName: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const teamsRef = db.collection('teams');
    setSubmitErrorMessage('');

    await teamsRef.get().then((snapshot) => {
      let teamList = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Team;
        const teamId = data.teamId;
        if (data.teamName === teamName && data.password === password) {
          setSelectedTeamInfo({ teamId, teamName });
          Router.push('/teams/profile');
        } else {
          teamList.push(data.teamName);
          return false;
        }
      });
      if (teamList.length === snapshot.docs.length) {
        setSubmitting(false);
        setSubmitErrorMessage('団体名かパスワードが間違っています');
      }
      if (snapshot.empty) {
        setSubmitting(false);
        setSubmitErrorMessage('団体が存在しません');
      }
    });
  };

  return (
    <TeamJoin
      userJoinToTeam={userJoinToTeam}
      submitErrorMessage={submitErrorMessage}
      setSubmitErrorMessage={setSubmitErrorMessage}
    />
  );
};

export default EnhancedTeamJoin;
