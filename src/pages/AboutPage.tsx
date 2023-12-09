import {
  Grid,
  GridItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
  Flex,
  Container,
  Box,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  ListItem,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import GeoMap from "../components/GeoMap";
import NavBar from "../components/NavBar";
import SideWindow from "../components/SideWindow";

import * as d3 from "d3";
import { userAuth } from "./Auth";
import { Navigate } from "react-router-dom";
import NewPost from "../components/NewPost";
import ImageGrid from "../components/ImageGrid";
import PostGrid from "../components/PostGrid";
import ImageUpload from "../components/ImageUpload";
import axios from "axios";
import { Plan } from "../components/NewPlan";
import { decrement } from "../store/modules/publishStore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

const AboutPage = () => {
  const user = userAuth();
  // if (user?.email === null && user?.isLogged === false) {
  //   return <Navigate to="/login"></Navigate>;
  // }

  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");

  if (!userId) {
    return <Navigate to="/login"></Navigate>;
  } else {
    // console.log(sessionStorage.getItem("userId"));
  }

  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [province, setProvince] = useState("");

  // Retrieve the active tab from local storage on component mount
  const storedTab = localStorage.getItem("activeTab");
  const [activeTab, setActiveTab] = useState(storedTab || "Travel History");

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  function getProvince(province: string) {
    setProvince(province);
    //console.log(province);
  }

  const [plans, setPlans] = useState<Plan[]>([]);
  const { count } = useSelector((state: RootState) => state.publish);
  useEffect(() => {
    async function getPlans() {
      const allPlans = await axios.get("http://localhost:4000/api/plans", {
        params: {
          where: `{"author": "${userId}"}`,
        },
      });
      setPlans(allPlans.data.data);
    }
    getPlans();
  }, [count]);

  const dispatch = useDispatch();
  const deletePlan = async (planId: string) => {
    await axios.delete("http://localhost:4000/api/plans/" + planId);
    dispatch(decrement());
  };

  return (
    <Grid templateAreas={`"nav nav" "main main"`}>
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main">
        <Tabs
          isFitted
          variant="enclosed"
          marginTop={10}
          marginLeft={10}
          marginRight={10}
          index={
            activeTab === "My Plans"
              ? 1
              : activeTab === "My Posts"
              ? 2
              : activeTab === "Settings"
              ? 3
              : 0
          }
          onChange={(index) => {
            // Update the active tab on tab change
            switch (index) {
              case 0:
                setActiveTab("Travel History");
                break;
              case 1:
                setActiveTab("My Plans");
                break;
              case 2:
                setActiveTab("My Posts");
                break;
              case 3:
                setActiveTab("Settings");
                break;
              default:
                break;
            }
          }}
        >
          <TabList mb="1em">
            <Tab>Travel History</Tab>
            <Tab>My Plans</Tab>
            <Tab>My Posts</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex>
                <GeoMap
                  onProvince={getProvince}
                  scale={800}
                  height={700}
                  weight={1000}
                  centerX={33}
                  centerY={16}
                  initMapColor={"transparent"}
                  initStrokeColor={"#aaa"}
                />
                <Box>
                  <Box
                    className="innerScroll"
                    height={700}
                    width={800}
                    margin={0}
                  >
                    <ImageGrid
                      user={userId}
                      admin={true}
                      search={false}
                      searchText={""}
                      province={province}
                    ></ImageGrid>
                  </Box>
                  <Center>
                    <ImageUpload province={province}></ImageUpload>
                  </Center>
                </Box>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Accordion allowMultiple>
                {plans.map((plan) => {
                  return (
                    <AccordionItem key={plan._id}>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Text fontSize="xl" fontWeight={500} color={"orange"}>
                            {plan.name}
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} key={`"ap_" + ${plan._id}`}>
                        <UnorderedList key={`"ls_" + ${plan._id}`}>
                          {plan.stops.map((stop, index) => {
                            return (
                              <ListItem
                                key={"item_" + stop.spot + index}
                                margin={3}
                              >
                                <Text
                                  fontWeight={500}
                                  color={"rgb(56, 189, 248)"}
                                >
                                  {stop.spotName}
                                </Text>
                                <p>
                                  {(stop.startTime + "").substring(0, 10) +
                                    " -- " +
                                    (stop.endTime + "").substring(0, 10)}
                                </p>
                                <p>{stop.note}</p>
                                <Divider marginTop={2} />
                              </ListItem>
                            );
                          })}
                        </UnorderedList>
                        <Box marginTop={3}>
                          {/* <Button marginRight={2} colorScheme="blue">
                            Edit
                          </Button> */}
                          <Button
                            marginLeft={2}
                            colorScheme="red"
                            onClick={() => deletePlan(plan._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabPanel>
            <TabPanel position="relative">
              <Center>
                <NewPost />
              </Center>
              <PostGrid
                user={userId}
                admin={true}
                search={false}
                searchText=""
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
  );
};

export default AboutPage;
