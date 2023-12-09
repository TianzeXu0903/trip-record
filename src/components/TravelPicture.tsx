import React, { useEffect, useRef, useState } from "react";
import "./carousel.css";
import { AbsoluteCenter, Box, Center, Flex } from "@chakra-ui/layout";
import {
  Icon,
  IconButton,
  Image,
  position,
  useBreakpointValue,
} from "@chakra-ui/react";
import { auto } from "@popperjs/core";
import { pointer } from "d3-selection";

import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

interface Props {
  picture: string;
}

const TravelPicture = ({ picture }: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  const carouselRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({
    width: "200px",
    height: "100px",
  });
  const [curProportion, setCurProportion] = useState<number>(1);
  const carouselProportion = 0.75428571428;

  return (
    <Center pos={"relative"}>
     
      <Box
        bgColor={"black"}
        width={"525px"}
        height={"700px"}
        borderRadius={10}
        className="carousel"
      >
        <Flex margin={auto} className="carousel_flex">
          <Image
            src={picture}
            ref={imgRef}
            // style={{ width: imageSize.width, height: imageSize.height }}
            className="carousel_img"
          />
        </Flex>

      </Box>

   
    </Center>
  );
};

export default TravelPicture;
