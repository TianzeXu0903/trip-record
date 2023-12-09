import {
  HStack,
  Image,
  Button,
  Avatar,
  VStack,
  Text,
  Box,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  useColorModeValue,
  MenuDivider,
} from "@chakra-ui/react";
import logo from "../assets/logo.png";
import ColorModeSwitch from "./ColorModeSwitch";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { userAuth } from "../pages/Auth";
import { useNavigate } from "react-router-dom";
// import LocalStorageRestore from "../pages/LocalStorageRestore";

const NavBar = () => {
  const user = userAuth();
  const navigate = useNavigate();
  function handleLogOut(): void {
    user?.logout();
    sessionStorage.clear();
    navigate("/Login");
  }

  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");

  return (
    <HStack justifyContent="space-between" padding="10px" boxShadow="2xl">
      <HStack>
        <Image src={logo} boxSize="60px" margin="5px" />
        <Link to="/">
          <Button colorScheme="teal" variant="ghost" size="lg" marginLeft={10}>
            Home
          </Button>
        </Link>
        <Link to="/discover">
          <Button colorScheme="teal" variant="ghost" size="lg" marginLeft={10}>
            Discover
          </Button>
        </Link>
        <Link to="/design">
          <Button colorScheme="teal" variant="ghost" size="lg" marginLeft={10}>
            Design Your Trip
          </Button>
        </Link>
      </HStack>
      <HStack>
        <ColorModeSwitch />
        <Menu>
          <MenuButton>
            <HStack paddingRight={10}>
              <Avatar bg="teal.500" marginLeft={10} />
              <VStack
                display={{ base: "none", md: "flex" }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm" color="teal">
                  {userName}
                </Text>
                <Text fontSize="xs" color="teal">
                  User
                </Text>
              </VStack>
              <Box display={{ base: "none", md: "flex" }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Link to="/about">
              <MenuItem>About Me</MenuItem>
            </Link>
            <MenuItem>Settings</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogOut}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};
export default NavBar;
