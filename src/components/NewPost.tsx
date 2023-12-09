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

const S3_BUCKET = "409-proj";
const REGION = "us-east-2";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "AKIA4C4SU62GUMGXJDK3",
    secretAccessKey: "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"
  }
});


interface Props {}

const NewPost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = userAuth();

  const initialRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLTextAreaElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [currList, setCurrList] = useState<string[]>([]);
  let urls: string[] = [];

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

  async function onSubmit() {
    const tagArr =
      tagRef.current === null ? "" : tagRef.current.value.split("#");
    let trimmedTags: any;
    if (tagArr !== "") {
      trimmedTags = tagArr.map((part) => part.trim());
    }

    const filteredTags = trimmedTags!.filter((part: any) => part !== "");
    // console.log(finalRef.current === null ? "" : finalRef.current.value);
    await axios.post("http://localhost:4000/api/posts", {
      title: initialRef.current === null ? "" : initialRef.current.value,
      tags: filteredTags,
      pictures: currList,
      content: finalRef.current === null ? "" : finalRef.current.value,
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
  }
  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        onClick={onOpen}
        size={"lg"}
        colorScheme="teal"
        as="b"
        marginBottom={5}
      >
        New Post
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
          <ModalHeader>Publish your new post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input ref={initialRef} placeholder="Title of your new post" />
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
              {currList.map((url) => (
                <img key={url} src={url} alt="" />
              ))}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input ref={tagRef} placeholder="Explore new topic" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Content</FormLabel>
              <Textarea ref={finalRef} placeholder="New content" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onSubmit} colorScheme="blue" mr={3}>
              Publish
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewPost;
