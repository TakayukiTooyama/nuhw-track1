import React, { FC, useState } from 'react';
import Router from 'next/router';
import { Box, Stack, Text } from '@chakra-ui/react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';

import { db } from '../../../lib/firebase';
import { FormButton, FormInput } from '../../molecules';
import { Team } from '../../../models/teams';
import { useAuthentication } from '../../../hooks/useAuthentication';
import { UserAuth } from '../../../models/users';

type FormValues = {
  teamName: string;
  password: string;
};

const TeamJoin: FC = () => {
  //Global State
  const { userAuth } = useAuthentication();

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
    if (userAuth === null) return;
    const teamsRef = db.collection('teams').doc('e2ZQAbPvnqMvTFUktAGC');
    const usersRef = db.collection('users').doc(userAuth.uid);
    setSubmitErrorMessage('');

    await teamsRef.get().then(async (doc) => {
      const data = doc.data() as Team;
      const teamId = data.teamId;
      const newData: UserAuth = {
        uid: userAuth.uid,
        photoURL: userAuth.photoURL,
        displayName: userAuth.displayName,
      };

      // 団体名とパスワードによる認証
      if (data.teamName === teamName && data.password === password) {
        await usersRef
          .set({ ...newData, teamInfo: { teamId, teamName } })
          .then(() => {
            Router.push('/teams/profile');
          });
      } else {
        setSubmitting(false);
        setSubmitErrorMessage('団体名かパスワードが間違っています');
        return false;
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
          <Box mb={4} />
          <Text color="red.400" textAlign="center">
            {submitErrorMessage}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default TeamJoin;
