import ky from 'ky-universal';
import { useQuery } from 'react-query';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const fetchPosts = async (limit = 10) => {
  const posts = (await ky(
    'https://jsonplaceholder.typicode.com/posts'
  ).json()) as Post[];
  const filterPosts = posts.filter((x) => x.id <= limit);
  return filterPosts;
};

const fetchPost = async (id: string) => {
  const post = (await ky(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).json()) as Post;
  return post;
};

const usePosts = (limit: number) => {
  return useQuery(['posts', limit], () => fetchPosts(limit));
};

export { usePosts, fetchPosts, fetchPost };
