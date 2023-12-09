import { Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
import SearchInput from "../components/SearchInput";
import PostGrid from "../components/PostGrid";
import { userAuth } from "./Auth";
import { Navigate } from "react-router-dom";

const DiscoverPage = () => {
  const [searchText, setSearchText] = useState("");
  function getInputText(msg: string) {
    console.log(msg);
    setSearchText(msg);
  }

  const user = userAuth();
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");
  // if (user?.email === null && user?.isLogged === false) {
  //   return <Navigate to="/login"></Navigate>;
  // }

  if (!userId) {
    return <Navigate to="/login"></Navigate>;
  } else {
    // console.log(sessionStorage.getItem("userId"));
  }

  return (
    <Grid templateAreas={`"nav nav" "main main"`}>
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main" marginLeft={10} marginRight={10}>
        <SearchInput onSearch={getInputText} />
        {searchText === "" ? (
          <PostGrid user="" admin={false} search={false} searchText="" />
        ) : (
          <PostGrid
            user=""
            admin={false}
            search={true}
            searchText={searchText}
          />
        )}
      </GridItem>
    </Grid>
  );
};

export default DiscoverPage;
