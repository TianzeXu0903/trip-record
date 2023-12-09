import { MouseEvent, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideDrawer from "../components/SideDrawer";
import GeoMap from "../components/GeoMap";
import { userAuth } from "./Auth";
import * as d3 from "d3";
import SideWindow from "../components/SideWindow";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const user = userAuth();

  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('UserName');
  // if (user?.email === null && user?.isLogged === false) {
  //   return <Navigate to="/login"></Navigate>;
  // }

    if (!userId) {
        return <Navigate to="/login"></Navigate>;
    }else{
        console.log(sessionStorage.getItem('userId'))
    }
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [province, setProvince] = useState("");
  function getProvince(province: string) {
    setProvince(province);
  }

  return (
    <Grid templateAreas={`"nav nav" "main aside"`}>
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main">
        <GeoMap
          onProvince={getProvince}
          scale={1000}
          height={835}
          weight={1300}
          centerX={40}
          centerY={24}
          initMapColor={"#ddd"}
          initStrokeColor={"#aaa"}
        />
      </GridItem>
      <GridItem area="aside">
        <SideWindow curProvince={province} width={500} />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
