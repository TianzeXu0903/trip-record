import { Flex, Grid, GridItem } from "@chakra-ui/react";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { userAuth } from "./Auth";
import { Navigate } from "react-router-dom";
import Carousel from "../components/Carousel";
import GeoMap from "../components/GeoMap";
import SideWindow from "../components/SideWindow";
import NewPlan from "../components/NewPlan";
import SpotSelector, { Spot } from "../components/SpotSelector";

const DesignPage = () => {
  const user = userAuth();
  // if (user?.email === null && user?.isLogged === false) {
  //   return <Navigate to="/login"></Navigate>;
  // }

  const userId = sessionStorage.getItem("userId");
  // if (user?.email === null && user?.isLogged === false) {
  //   return <Navigate to="/login"></Navigate>;
  // }

  if (!userId) {
    return <Navigate to="/login"></Navigate>;
  } else {
    // console.log(sessionStorage.getItem('userId'))
  }

  const [province, setProvince] = useState("");
  function getProvince(province: string) {
    setProvince(province);
  }

  const [spotsList, setSpotsList] = useState<Spot[]>([]);
  const [startDateList, setStartDateList] = useState<Date[]>([]);
  const [endDateList, setEndDateList] = useState<Date[]>([]);
  const [contentList, setContentList] = useState<String[]>([]);

  const getSelectedSpot = (spot: Spot) => {
    setSpotsList([...spotsList, spot]);

    // Deal with time
    setStartDateList([...startDateList, new Date()]);
    setEndDateList([...endDateList, new Date()]);
    // Deal with content
    setContentList([...contentList, ""]);
  };

  const getRemovedSpot = (spot: Spot, index: number) => {
    setSpotsList([...spotsList.slice(0, index), ...spotsList.slice(index + 1)]);
    // Deal with time
    setStartDateList([
      ...startDateList.slice(0, index),
      ...startDateList.slice(index + 1),
    ]);
    setEndDateList([
      ...endDateList.slice(0, index),
      ...endDateList.slice(index + 1),
    ]);
    // Deal with content
    setContentList([
      ...contentList.slice(0, index),
      ...contentList.slice(index + 1),
    ]);
  };

  const getChangedStart = (date: Date, index: number) => {
    setStartDateList([
      ...startDateList.slice(0, index),
      date,
      ...startDateList.slice(index + 1),
    ]);
  };

  const getChangedEnd = (date: Date, index: number) => {
    setEndDateList([
      ...endDateList.slice(0, index),
      date,
      ...endDateList.slice(index + 1),
    ]);
  };

  const getChangedContent = (content: any, index: number) => {
    setContentList([
      ...contentList.slice(0, index),
      content,
      ...contentList.slice(index + 1),
    ]);
  };

  return (
    <Grid templateAreas={`"nav nav" "main aside"`}>
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main">
        <GeoMap
          onProvince={getProvince}
          scale={900}
          height={835}
          weight={1000}
          centerX={41}
          centerY={23}
          initMapColor={"#ddd"}
          initStrokeColor={"#aaa"}
        />
      </GridItem>
      <GridItem area="aside">
        <Flex>
          <SpotSelector
            curProvince={province}
            width={300}
            handleGetSelectSpot={getSelectedSpot}
          />
          <NewPlan
            width={400}
            spotsList={spotsList}
            startDateList={startDateList}
            endDateList={endDateList}
            contentList={contentList}
            handleGetRemoveSpot={getRemovedSpot}
            handleGetStart={getChangedStart}
            handelGetEnd={getChangedEnd}
            handelGetContent={getChangedContent}
          ></NewPlan>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default DesignPage;
