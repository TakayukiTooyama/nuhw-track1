import React, { FC, useState } from 'react';
import Router from 'next/router';
import { Box, Stack, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useSetRecoilState } from 'recoil';

import { db } from '../../../lib/firebase';
import { FormButton, FormInput } from '../../molecules';
import { selectedTeamInfo } from '../../../recoil/teams/team';
import { Team } from '../../../models/teams';

export type Values = {
  teamName: string;
  password: string;
  confirmPassword: string;
};

const TeamCreate: FC = () => {
  //Global State
  const setSelectedTeamInfo = useSetRecoilState(selectedTeamInfo);

  //Local State
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  //Formik State
  const initialValues: Values = {
    teamName: '',
    password: '',
    confirmPassword: '',
  };

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
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        teamName: yup
          .string()
          .max(30, '30文字以内で入力してください')
          .required('必須項目'),
        password: yup
          .string()
          .matches(/^[0-9a-zA-Z]+$/, '半角英数字のみ')
          .min(6, '6文字以上で入力してください')
          .required('必須項目'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], 'パスワードと異なります')
          .required('必須項目'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        createTeam(values.teamName, values.password, setSubmitting);
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
            <FormInput
              label="パスワード確認"
              name="confirmPassword"
              type="password"
              setSubmitErrorMessage={setSubmitErrorMessage}
            />
          </Stack>
          <Box mb={10}></Box>
          <FormButton
            type="submit"
            label="作成"
            bg="orange.400"
            isLoading={isSubmitting}
            disabled={!isValid || !dirty}
          />
          <Box mb={4}></Box>
          <Text textAlign="center" color="red.400">
            {submitErrorMessage}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default TeamCreate;
