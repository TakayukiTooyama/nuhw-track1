import Head from 'next/head';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { fetchPosts, Post } from '../../hooks/usePosts';
import { useState } from 'react';
import { Skeleton, Stack } from '@chakra-ui/react';

interface ISRProps {
  posts: Post[];
}

export default function ISR({ posts }: ISRProps) {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Head>
        <title>ISRの解説用ページ（Postリンク一覧）</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Postのリンク一覧</h1>
        {loading ? (
          <Stack spacing={1}>
            <Skeleton h="20px" />
            <Skeleton h="20px" />
            <Skeleton h="20px" />
            <Skeleton h="120px" />
          </Stack>
        ) : (
          <ul>
            {posts &&
              posts.map((post) => (
                <li key={post.id} onClick={() => setLoading(true)}>
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </li>
              ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<ISRProps> = async (
  _context: GetStaticPropsContext
) => {
  const posts = await fetchPosts(10);
  return {
    props: {
      posts,
    },
  };
};
