import React, { useState } from 'react';
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
    Text
  } from '@chakra-ui/react'
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';



const Register = () => {
    const[registerEmail,setRegisterEmail]=useState<string>("");
    const[registerPassword,setRegisterPassword]=useState<string>("");
    const[registerName,setRegisterName]=useState<string>("");
    const[error,setError]=useState<string>("");
    const navigate=useNavigate();
  
      const handleLogin = async()=> {
      if(registerEmail.trim()==='' || registerPassword.trim()==='' || registerName.trim()===''){
        setError("The fields are incomplete,Please fill in the missing information");
        return;
      }
      try{
          const response=await axios.post('http://localhost:4000/api/users',{
            name:registerName,
            email:registerEmail,
            password: registerPassword
            
          });
          if(response.status===201){
            console.log(response.data.data.newUser);
            navigate('/login');
          }
      }catch(error:any){ 
        if(error.response.status===403){
          setError(error.response.data.data);
        }else{
          setError(error.response.data.message);
        }   
       
         
      }
      
     };
    
  
    return (
     <>
      <Container maxW="sm">
        <Box mt="20" p="10" borderWidth="1px" borderRadius="lg">
          <Heading fontSize={25}  textColor={"teal"} textAlign="center" mb="10">
            Create Account
          </Heading>
          <FormControl id="registerName" mb="4">
            <FormLabel>Account Name</FormLabel>
            <Input type="text" value={registerName} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {setRegisterName(e.target.value);}} />
          </FormControl>
          <FormControl id="registerEmail" mb="6">
            <FormLabel>Email Address</FormLabel>
            <Input type="email" value={registerEmail} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRegisterEmail(e.target.value)} />
          </FormControl>
          <FormControl id="registerPassword" mb="6">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={registerPassword} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRegisterPassword(e.target.value)} />
          </FormControl>
          <Box ml='20' mb="5">
          <Button colorScheme="teal" size="lg"  onClick={handleLogin}>
            Register
          </Button>
          </Box>
          {error && <Text>{error}</Text>}
          
        </Box>
      </Container>
     </>
    )
  }

export default Register

