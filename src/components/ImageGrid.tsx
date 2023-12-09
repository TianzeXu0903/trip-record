import { Link, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";
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
  province: string;
}
export const provinceNameMap = new Map();
provinceNameMap.set("北京", "Beijing");
provinceNameMap.set("江苏", "Jiangsu");
provinceNameMap.set("内蒙古", "Inner Mongolia");
provinceNameMap.set("新疆", "Xinjiang");
provinceNameMap.set("西藏", "Tibet");
provinceNameMap.set("青海", "Qinghai");
provinceNameMap.set("甘肃", "Gansu");
provinceNameMap.set("四川", "Sichuan");
provinceNameMap.set("广西", "Guangxi");
provinceNameMap.set("广东", "Guangdong");
provinceNameMap.set("福建", "Fujian");
provinceNameMap.set("浙江", "Zhejiang");
provinceNameMap.set("安徽", "Anhui");
provinceNameMap.set("江西", "Jiangxi");
provinceNameMap.set("湖南", "Hunan");
provinceNameMap.set("湖北", "Hubei");
provinceNameMap.set("河南", "Henan");
provinceNameMap.set("山东", "Shandong");
provinceNameMap.set("山西", "Shanxi");
provinceNameMap.set("河北", "Hebei");
provinceNameMap.set("天津", "Tianjin");
provinceNameMap.set("辽宁", "Liaoning");
provinceNameMap.set("吉林", "Jilin");
provinceNameMap.set("黑龙江", "Heilongjiang");
provinceNameMap.set("台湾", "Taiwan");
provinceNameMap.set("海南", "Hainan");
provinceNameMap.set("南海诸岛", "Nanhaizhudao");
provinceNameMap.set("香港", "Hong Kong");
provinceNameMap.set("澳门", "Macao");
provinceNameMap.set("上海", "Shanghai");
provinceNameMap.set("云南", "Yunnan");
provinceNameMap.set("重庆", "Chongqing");
provinceNameMap.set("陕西", "Shaanxi");
provinceNameMap.set("宁夏", "Ningxia");
provinceNameMap.set("贵州", "Guizhou");
const ImageGrid = ({ user, admin, search, searchText, province }: Props) => {
  const [pictures, setPictures] = useState<string[]>([]);
  const { count } = useSelector((state: RootState) => state.publish);

  let provinceValue = provinceNameMap.get(province);

  //console.log(province);
  async function getPictures() {
    let res = null;
    if (
      user &&
      admin === true &&
      search === false &&
      searchText === "" &&
      provinceValue
    ) {
      //console.log(provinceValue);
      res = await axios.get("http://localhost:4000/api/users/" + user, {
        params: {
          // author: {user}, province: {provinceValue}
          where: `{"province": "${provinceValue}"}`,
        },
      });
      // const photos=[
      //     "https://409-proj.s3.us-east-2.amazonaws.com/Screenshot%202023-12-01%20at%2012.12.01%20AM.png",
      //     "https://409-proj.s3.us-east-2.amazonaws.com/Screenshot%202023-12-01%20at%2012.11.59%20AM.png"
      //   , "https://409-proj.s3.us-east-2.amazonaws.com/uoft.jpg",
      //   "https://409-proj.s3.us-east-2.amazonaws.com/Screenshot%20from%202023-11-30%2000-58-11.png",
      //   "https://409-proj.s3.us-east-2.amazonaws.com/Screenshot%20from%202023-11-30%2000-33-00.png"];
      // setPictures(photos);
      setPictures(res.data.data);
    }
  }

  useEffect(() => {
    getPictures();
  }, [provinceValue, count]);

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
        {pictures.map((picture) => (
          <ImageCard
            key={picture}
            picture={picture}
            admin={admin}
            province={provinceValue}
          />
        ))}
      </Masonry>
    </>
  );
};

export default ImageGrid;
