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
  pictures: string[];
}

const Carousel = ({ pictures }: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
  };

  const previousImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? pictures.length - 1 : prevIndex - 1
    );
  };
  const carouselRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({
    width: "200px",
    height: "100px",
  });
  const [curProportion, setCurProportion] = useState<number>(1);
  const carouselProportion = 0.75428571428;

  return (
    <Center pos={"relative"}>
      <IconButton
        bgColor={"grey"}
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform={"translate(0%, -50%)"}
        zIndex={2}
        onClick={previousImage}
      >
        <ArrowLeftIcon />
      </IconButton>
      <Box
        bgColor={"black"}
        width={"525px"}
        height={"700px"}
        borderRadius={10}
        className="carousel"
      >
        <Flex margin={auto} className="carousel_flex">
          <Image
            src={pictures[currentIndex]}
            ref={imgRef}
            key={currentIndex}
            // style={{ width: imageSize.width, height: imageSize.height }}
            className="carousel_img"
          />
        </Flex>

        <Box className="indicator">
          <Center>
            <Box
              bgColor={"rgba(60, 60, 60, 0.5)"}
              borderRadius={10}
              pos={"absolute"}
              bottom={0}
              marginBottom={3}
            >
              <Flex margin="auto" className="carousel_flex">
                {pictures.map((picture, index) => (
                  <Box
                    key={index}
                    bgColor={"rgb(130, 134, 136)"}
                    width={3}
                    height={3}
                    margin={2}
                    borderRadius={50}
                    borderColor={"white"}
                    cursor={"pointer"}
                    opacity={currentIndex === index ? 1 : 0.5}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </Flex>
            </Box>
          </Center>
        </Box>
      </Box>

      <IconButton
        bgColor={"grey"}
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform={"translate(0%, -50%)"}
        zIndex={2}
        onClick={nextImage}
      >
        <ArrowRightIcon />
      </IconButton>
    </Center>
  );
};

export default Carousel;
