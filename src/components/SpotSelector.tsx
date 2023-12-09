import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Drawer,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import "../index.css";
import { right } from "@popperjs/core";

export interface Spot {
  _id: string;
  provinceL: string;
  pictures: string[];
  name: string;
  link: string;
  description: string;
  city: string;
}

interface Props {
  width: number;
  curProvince: string;
  handleGetSelectSpot: (spot: Spot) => void;
}

const SpotSelector = ({ width, curProvince, handleGetSelectSpot }: Props) => {
  const [province, setProvince] = useState("");
  const [spots, setSpots] = useState([]);
  const provinceNameMap = new Map();
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

  useEffect(() => {
    setProvince(curProvince);
    async function getSpotsByProvince() {
      let provinceValue = provinceNameMap.get(curProvince);
      const res = await axios.get("http://localhost:4000/api/spots", {
        params: {
          where: `{"province": "${provinceValue}"}`, // Make sure to stringify the object as a JSON string
        },
      });
      setSpots(res.data.data);
    }
    getSpotsByProvince();
  }, [curProvince]);

  const handleAdd = (spot: Spot) => {
    handleGetSelectSpot(spot);
  };

  return (
    <Accordion
      width={width}
      defaultIndex={[0]}
      allowMultiple
      className="innerScroll"
      margin={10}
    >
      {spots.map((spot) => {
        return (
          <AccordionItem key={spot["_id"]}>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {spot["name"]}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {spot["description"]}
              <Box>
                <Button
                  colorScheme="blue"
                  float={right}
                  margin={2}
                  onClick={() => handleAdd(spot)}
                >
                  Add
                </Button>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default SpotSelector;
