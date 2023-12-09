import { Link, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../hooks/usePosts";
import axios from "axios";
import Masonry from "react-masonry-css";
import "./masonry-layout.css";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../store/modules/publishStore";

interface Props {
  user: string | null | undefined;
  admin: boolean;
  search: boolean;
  searchText: string;
}

const PostGrid = ({ user, admin, search, searchText }: Props) => {
  const [posts, setPosts] = useState([]);
  const { count } = useSelector((state: RootState) => state.publish);

  async function getPosts() {
    let res;
    if (!user || user === null || user === "") {
      if (search === true && searchText !== "") {
        res = await axios.get("http://localhost:4000/api/posts", {
          params: {
            where: `{"title": "${searchText}", "tags": "${searchText}"}`,
          },
        });
      } else {
        res = await axios.get("http://localhost:4000/api/posts");
      }
    } else {
      res = await axios.get("http://localhost:4000/api/posts", {
        params: {
          where: `{"author": "${user}"}`,
        },
      });
    }
    setPosts(res.data.data);
  }

  useEffect(() => {
    getPosts();
  }, [searchText, count]);

  const breakpointColumnsObj = {
    default: 5, // default number of columns
    1100: 4, // 4 columns for screen widths of 1100px or less
    700: 3, // 3 columns for screen widths of 700px or less
    500: 2, // 2 columns for screen widths of 500px or less
  };

  return (
    <>
      {/* <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
        spacing={10}
        padding={10}
      >
        {posts.map((post) => (
          <PostCard post={post} key={post["id"]} admin={admin} />
        ))} 
      </SimpleGrid> */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <PostCard post={post} key={post["_id"]} admin={admin} />
        ))}
      </Masonry>
    </>
  );
};

export default PostGrid;
