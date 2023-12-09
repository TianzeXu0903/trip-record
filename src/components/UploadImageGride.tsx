import React from "react";
import Masonry from "react-masonry-css";
import "./UploadImage.css";
import { Button, Card, CardBody } from "@chakra-ui/react";

interface Props {
  url: string;
  isOrigin: boolean;
  onDelete: (url: string) => void;
}

const UploadImageGride = ({ url, isOrigin, onDelete }: Props) => {
  return (
    <Card key={url} maxW={40} maxH="sm">
      <CardBody>
        <img src={url} alt="" />
        {isOrigin ? (
          <Button
            colorScheme="red"
            size="sm"
            float={"right"}
            marginTop={4}
            onClick={() => onDelete(url)}
          >
            Delete
          </Button>
        ) : (
          <></>
        )}
      </CardBody>
    </Card>
  );
};

export default UploadImageGride;
