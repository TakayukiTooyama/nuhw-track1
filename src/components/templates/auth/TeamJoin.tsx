import React, { FC, useState } from 'react';
import Router from 'next/router';
import { Box, Stack, Text } from '@chakra-ui/react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { useSetRecoilState } from 'recoil';

import { db } from '../../../lib/firebase';
import { FormButton, FormInput } from '../../molecules';
import { selectedTeamInfo } from '../../../recoil/teams/team';
import { Team } from '../../../models/teams';

type FormValues = {
  teamName: string;
  password: string;
};

const TeamJoin: FC = () => {
  //Global State
  const setSelectedTeamInfo = useSetRecoilState(selectedTeamInfo);

  //Local State
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  //Formik State
  const initialValues: FormValues = {
    teamName: '',
    password: '',
  };

  //団体参加処理
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
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        teamName: yup.string().required('必須項目'),
        password: yup.string().required('必須項目'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        userJoinToTeam(values.teamName, values.password, setSubmitting);
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          <Stack spacing={8}>
            <FormInput
              label="団体名"
              name="teamName"
              setSubmitErrorMessage={setSubmitErrorMessage}
            />
            <FormInput
              label="パスワード"
              name="password"
              type="password"
              setSubmitErrorMessage={setSubmitErrorMessage}
            />
          </Stack>
          <Box mb={10}></Box>
          <FormButton
            type="submit"
            label="参加"
            bg="blue.400"
            isLoading={isSubmitting}
            disabled={!isValid || !dirty}
          />
          <Box mb={4}></Box>
          <Text color="red.400" textAlign="center">
            {submitErrorMessage}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default TeamJoin;
