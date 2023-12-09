import React, { useState, useContext, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { userAuth } from "./Auth";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Container,
  Box,
  Heading,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";

const Login = () => {
  const user = userAuth();
  const [userId, setUserId] = useState<string>("");
  const [email, setUserEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogged, setLogged] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  //   useEffect(()=>{
  //     const saveUser=JSON.parse(localStorage.getItem('user.email') || '');
  //     if(saveUser){
  //         setUser(saveUser);
  //     }
  //   },[])

  //   useEffect(()=>{
  //     const saveUser=JSON.parse(localStorage.getItem('user.email') || '');
  //     if(saveUser){
  //         setUser(saveUser);
  //     }
  //   },[])

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError(
        "The fields are incomplete,Please fill in the missing information"
      );
      return;
    }
    await axios
      .post("http://localhost:4000/api/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          setLogged(true);
          // console.log(response.data.data._id);
          user?.setUserInfo(
            response.data.data._id,
            response.data.data.name,
            password,
            email
          );

          sessionStorage.setItem('userId', response.data.data._id);
          sessionStorage.setItem('userName', response.data.data.name);

          setUserName(response.data.data.name);
          setUserId(response.data.data._id);
          navigate("/");

          // localStorage.setItem('user',JSON.stringify({
          //     username:response.data.data,
          //     email:email,
          //     password:password
          // }))
          // user?.setUserInfo(response.data.data,password,email);
          // console.log(user?.username);
          // console.log(user?.userId);
        }
      })
      .catch((error) => {
        {
          if (error.response) {
            if (
              error.response.status === 404 ||
              error.response.status === 401
            ) {
              setError(error.response.data.message);
            }
          } else {
            setError("Unknown error");
          }
          setUserId("");
          setUserName("");
          setPassword("");
          setUserEmail("");
        }
      });
    // Handle login logic here
    //console.log('Logging in with:', { userName, password });
  };

  return (
    <>
      <Container maxW="sm">
        <Box mt="20" p="10" borderWidth="1px" borderRadius="lg">
          <Heading as="h1" textAlign="center" mb="10">
            Sign In
          </Heading>
          <FormControl id="email" mb="4">
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setUserEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" mb="6">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setPassword(e.target.value)}
            />
          </FormControl>
          <Box paddingLeft="2" mb="5">
            <Button colorScheme="teal" size="lg" onClick={handleLogin}>
              Sign In
            </Button>
            <Link to="/Register">
              <Button colorScheme="teal" size="lg" marginLeft={10}>
                Register
              </Button>
            </Link>
          </Box>
          {error && <Text>{error}</Text>}
        </Box>
      </Container>
    </>
  );
};

export default Login;
