import { divide } from "lodash";
import { useEffect, useState } from "react";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  createTime: { $date: string };
  tags: string[];
  pictures: string[];
}

interface FetchPostResponse {
  count: number;
  results: Post[];
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  return;
};
