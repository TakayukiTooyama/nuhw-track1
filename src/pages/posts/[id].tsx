import Head from 'next/head';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPaths,
  GetStaticPathsContext,
} from 'next';

import { fetchPost } from '../../hooks';
import { Box, Button } from '@chakra-ui/react';
import Link from 'next/link';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

interface ISRProps {
  post: Post;
  timestamp: number;
}

export default function ISRPostsId({ post, timestamp }: ISRProps) {
  return (
    <div>
      <Head>
        <title>ISRの解説用ページ（Post詳細）</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Post詳細（ISR）</h1>
        <div>
          <p>Post ID: {post?.id}</p>
          <p>User ID: {post?.userId}</p>
          <p>Title: {post?.title}</p>
          <p>Body: {post?.body}</p>
          <p>ISR確認用のtimestamp値: {timestamp}</p>
        </div>
        <Box mb={8} />
        <Link href="/posts" passHref>
          <Button shadow="base">戻る</Button>
        </Link>
      </main>
    </div>
  );
}

type ISRParams = {
  id: string;
};
export const getStaticPaths: GetStaticPaths<ISRParams> = async (
  _context: GetStaticPathsContext
) => {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ISRProps> = async (
  context: GetStaticPropsContext
) => {
  const params = context.params as ISRParams;
  const postId = params.id;
  const post = await fetchPost(postId);

  return {
    props: {
      post,
      timestamp: Date.now(),
    },

    revalidate: 3,
  };
};
