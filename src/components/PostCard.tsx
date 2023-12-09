import {
  Card,
  CardBody,
  HStack,
  Heading,
  Tag,
  Image,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  ModalContent,
  Modal,
  IconButton,
  useBreakpointValue,
  Stack,
  Center,
  Box,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { Post } from "../hooks/usePosts";
import noImage from "../assets/No_Image.jpg";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { pointer } from "d3-selection";
import axios from "axios";
import Carousel from "./Carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import "./postCard.css";
import { image } from "d3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { decrement } from "../store/modules/publishStore";
import EditPost from "./EditPost";

interface Props {
  post: Post;
  admin: boolean;
}

const PostCard = ({ post, admin }: Props) => {
  const [imageHeight, setImageHeight] = useState<string>("auto");
  const imageRef = useRef<HTMLImageElement>(null);
  const { count } = useSelector((state: RootState) => state.publish);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  async function handleDelete() {
    await axios.delete("http://localhost:4000/api/posts/" + post._id);
    dispatch(decrement());
  }

  const handleImageLoad = () => {
    if (imageRef.current) {
      const height = imageRef.current.offsetHeight + 200;
      setImageHeight(`${height}px`);
    }
  };

  useEffect(() => {
    // console.log("card height: ", imageHeight);
  }, [imageHeight]);

  return (
    <>
      <Card borderRadius={10} overflow={"hidden"} key={post._id} margin={3}>
        <CardBody onClick={onOpen} cursor={"pointer"}>
          <Image
            ref={imageRef}
            src={post.pictures[0] ? post.pictures[0] : noImage}
            borderRadius={10}
            width="100%"
            height="auto"
            objectFit="cover"
            onLoad={handleImageLoad}
          />
          <Heading fontSize="xl" margin={3}>
            {post.title}
          </Heading>
          <HStack>
            <Tag>{"Author: " + post.authorName}</Tag>
            <Tag>{"Tags: " + post.tags}</Tag>
          </HStack>
        </CardBody>
        {admin ? (
          <>
            <Box>
              <Stack direction="row" marginBottom={4} float={"right"}>
                <EditPost curPost={post} />
                <Button
                  colorScheme="red"
                  marginLeft={2}
                  marginRight={4}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </>
        ) : null}
      </Card>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{post.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Carousel pictures={post.pictures}></Carousel>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostCard;
