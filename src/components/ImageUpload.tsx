import { useState, ChangeEvent, useEffect } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Box, Button, Flex } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { provinceNameMap } from "./ImageGrid";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../store/modules/publishStore";

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
  province: string;
}

function ImageUpload({ province }: Props) {
  const dispatch = useDispatch();

  const [images, setImages] = useState<File[]>([]);
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
  }, [images]);

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
  const userId = sessionStorage.getItem("userId");
  const handleUploadClick = async () => {
    await axios.put("http://localhost:4000/api/users/" + userId, {
      pictures: urls,
      province: provinceNameMap.get(province),
    });
    dispatch(increment());
  };

  return (
    <Box width={"90%"} marginTop={10}>
      {urls.map((url) => (
        <img key={url} src={url} alt="" />
      ))}
      <Flex>
        <Button colorScheme="green" marginRight={10} width={80}>
          <input
            type="file"
            accept="image/gif,image/jpeg,image/jpg,image/png"
            multiple
            onChange={(e) => handleFileInput(e)}
          />
        </Button>
        <Button
          onClick={handleUploadClick}
          colorScheme="blue"
          width={80}
          marginLeft={10}
        >
          <FaUpload /> &nbsp;&nbsp; Upload pictures of your trip
        </Button>
      </Flex>
    </Box>
  );
}

export default ImageUpload;
