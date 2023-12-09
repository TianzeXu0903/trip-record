import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import { end, right } from "@popperjs/core";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Spot } from "./SpotSelector";
import { Center, Input } from "@chakra-ui/react";
import Login from "../pages/Login";
import axios from "axios";

export interface Plan {
  _id: string;
  name: string;
  author: string;
  stops: Stop[];
}

export interface Stop {
  startTime: Date;
  endTime: Date;
  note: string;
  spot: string;
  spotName: string;
}

interface Props {
  width: number;
  spotsList: Spot[];
  startDateList: Date[];
  endDateList: Date[];
  contentList: any[];
  handleGetRemoveSpot: (spot: Spot, index: number) => void;
  handleGetStart: (date: Date, index: number) => void;
  handelGetEnd: (date: Date, index: number) => void;
  handelGetContent: (content: any, index: number) => void;
}

const NewPlan = ({
  width,
  spotsList,
  startDateList,
  endDateList,
  contentList,
  handleGetRemoveSpot,
  handleGetStart,
  handelGetEnd,
  handelGetContent,
}: Props) => {
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");

  const handleRemove = (spot: Spot, index: number) => {
    handleGetRemoveSpot(spot, index);
  };

  const handleChangeStart = (date: Date, index: number) => {
    handleGetStart(date, index);
  };

  const handleChangeEnd = (date: Date, index: number) => {
    handelGetEnd(date, index);
  };

  const handleChangeContent = (content: any, index: number) => {
    handelGetContent(content, index);
  };

  const [title, setTitle] = useState("");
  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmitPlan = async () => {
    let stops: Array<Stop> = [];

    for (let i = 0; i < spotsList.length; i++) {
      const curStop: Stop = {
        startTime: startDateList[i],
        endTime: endDateList[i],
        note: contentList[i],
        spot: spotsList[i]._id,
        spotName: spotsList[i].name,
      };
      stops.push(curStop);
    }

    const newPlan: Plan = {
      _id: "",
      name: title,
      author: userId!,
      stops: stops,
    };

    if (newPlan.stops.length !== 0) {
      try {
        await axios.post("http://localhost:4000/api/plans", {
          name: newPlan.name,
          author: newPlan.author,
          stops: newPlan.stops,
        });
        alert("plan submitted successful");
        // setTitle("");
        // for (let i = 0; i < stops.length; i++) {
        //   const curSpot = await axios.get(
        //     "http://localhost:4000/api/spots/" + stops[i].spot
        //   );
        //   console.log(curSpot);
        //   handleRemove(curSpot.data, i);
        // }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Unknown type error");
        }
      }
    }
  };

  return (
    <Box marginTop={10}>
      <Center>
        <Input
          width={"90%"}
          placeholder="Type the name of your plan..."
          value={title}
          onChange={handleTitleInput}
        ></Input>
      </Center>

      <Accordion
        width={width}
        height={730}
        defaultIndex={[0]}
        allowMultiple
        className="innerScroll"
        marginTop={5}
        marginLeft={10}
        marginRight={10}
        marginBottom={5}
      >
        {spotsList.map((spot, index) => {
          return (
            <AccordionItem key={spot._id + index}>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    {spot.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <FormControl mt={4}>
                  <FormLabel>Note</FormLabel>
                  <Textarea
                    placeholder="New content"
                    value={contentList[index]}
                    onChange={(e) => {
                      handleChangeContent(e.target.value, index);
                    }}
                  />
                </FormControl>
                <Box margin={2}>
                  <span>Start: </span>
                  <DatePicker
                    selected={startDateList[index]}
                    onChange={(date: Date) => {
                      handleChangeStart(date, index);
                    }}
                  />
                </Box>

                <Box margin={2}>
                  <span>End: </span>
                  <DatePicker
                    selected={endDateList[index]}
                    onChange={(date: Date) => {
                      handleChangeEnd(date, index);
                    }}
                  />
                </Box>
                <Button
                  colorScheme="red"
                  marginTop={3}
                  onClick={() => handleRemove(spot, index)}
                  float={right}
                  margin={2}
                >
                  Remove
                </Button>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
      <Center>
        <Button width={"90%"} colorScheme="green" onClick={handleSubmitPlan}>
          Create a new plan
        </Button>
      </Center>
    </Box>
  );
};

export default NewPlan;
