import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Icon } from "@chakra-ui/icon";
import { Input } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Text } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import axios from "axios";
import { useRef, ChangeEvent, useEffect, useState } from "react";
import { userAuth } from "../pages/Auth";
import { AddIcon } from "@chakra-ui/icons";
import ImageUpload from "./ImageUpload";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { HStack, VStack } from "@chakra-ui/layout";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../store/modules/publishStore";
import { Store } from "redux";
import { RootState } from "../store";
import { log } from "console";
import { Post } from "../hooks/usePosts";
import { Box, Card, CardBody, Image, SimpleGrid } from "@chakra-ui/react";
import UploadImageGride from "./UploadImageGride";
import Masonry from "react-masonry-css";
import "./UploadImage.css";
import { set } from "mongoose";

const S3_BUCKET = "409-proj";
const REGION = "us-east-2";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "AKIA4C4SU62GUMGXJDK3",
    secretAccessKey: "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"
  }
});

interface Props {
  curPost: Post;
}

const EditPost = ({ curPost }: Props) => {
  const [post, setPost] = useState<Post>(curPost);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLTextAreaElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [currList, setCurrList] = useState<string[]>([]);
  const [originalList, setOriginalList] = useState<string[]>(curPost.pictures);
  let urls: string[] = [];

  const [title, setTitle] = useState(post.title);
  const [tags, setTags] = useState(
    post.tags.map((element) => "#" + element).join(" ")
  );
  const [content, setContent] = useState(post.content);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files); // Convert file list to an array
      setImages(fileArray); // Update the state with the new array of files
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      console.log("images: ", images); // Log the updated state
    }
    for (var i = 0; i < images.length; i++) {
      uploadFile(images[i]);
      const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(
        images[i].name
      )}`;
      urls.push(fileUrl);
    }
    setCurrList(urls);
  }, [images]);

  useEffect(() => {
    // console.log("currList is changed to: ", currList);
  }, [currList]);

  const uploadFile = async (file: File) => {
    const params = {
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      // Handle success
      console.log("File uploaded successfully", data);
    } catch (err: any) {
      // Handle error
      console.error("Upload Error:", err);
    }
  };

  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");

  async function onSubmit(postId: string) {
    console.log(originalList);
    console.log(currList);
    const mergedList = originalList.concat(currList);

    const tagArr =
      tagRef.current === null ? "" : tagRef.current.value.split("#");
    let trimmedTags: any;
    if (tagArr !== "") {
      trimmedTags = tagArr.map((part) => part.trim());
    }

    const filteredTags = trimmedTags!.filter((part: any) => part !== "");

    await axios.put("http://localhost:4000/api/posts/" + postId, {
      title: title === null ? "" : title,
      tags: filteredTags,
      pictures: mergedList,
      content: content === null ? "" : content,
      author: userId,
      authorName: userName,
    });

    dispatch(increment());
    setCurrList([]);
    onClose();
  }

  function handleClose() {
    onClose();
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    urls = [];
    setImages([]);
    setCurrList([]);
    setTitle(post.title);
    setTags(post.tags.map((element) => "#" + element).join(" "));
    setContent(post.content);
  }

  const breakpointColumnsObj = {
    default: 3, // default number of columns
    // 1100: 4, // 4 columns for screen widths of 1100px or less
    // 500: 3, // 3 columns for screen widths of 700px or less
    // 10: 2, // 2 columns for screen widths of 500px or less
  };

  const handleGetDelete = (url: string) => {
    const filteredArr = originalList.filter(function (value) {
      return value !== url;
    });
    setOriginalList(filteredArr);
  };

  const handleTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTagsInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  const handleContentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" marginBottom={1}>
        Edit
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit your post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title of your new post"
                value={title}
                onChange={(e) => handleTitleInput(e)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Images</FormLabel>
              <HStack>
                <Input
                  type="file"
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  multiple
                  ref={imageRef}
                  onChange={(e) => handleFileInput(e)}
                ></Input>
                <Button
                  onClick={() => {
                    if (imageRef.current) {
                      imageRef.current.value = "";
                    }
                    urls = [];
                    setImages([]);
                    setCurrList([]);
                  }}
                >
                  Clear
                </Button>
              </HStack>
              <Text marginTop={2}> Original pictures : </Text>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {originalList.map((url) => (
                  <UploadImageGride
                    key={url}
                    url={url}
                    isOrigin={true}
                    onDelete={handleGetDelete}
                  ></UploadImageGride>
                ))}
              </Masonry>
              <Text> Newly added pictures : </Text>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {currList.map((url) => (
                  <UploadImageGride
                    url={url}
                    isOrigin={false}
                    onDelete={() => {}}
                  ></UploadImageGride>
                ))}
              </Masonry>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                ref={tagRef}
                placeholder="Explore new topic"
                value={tags}
                onChange={(e) => handleTagsInput(e)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Content</FormLabel>
              <Textarea
                ref={finalRef}
                placeholder="New content"
                value={content}
                onChange={(e) => handleContentInput(e)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => onSubmit(post._id)}
              colorScheme="blue"
              mr={3}
            >
              Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPost;
