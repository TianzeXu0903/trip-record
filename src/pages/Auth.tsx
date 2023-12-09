import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

interface UserType {
  userId: string | null;
  username: string | null;
  password: string | null;
  email: string | null;
  isLogged: boolean;
  setUserInfo: (
    userId: string,
    username: string,
    email: string,
    password: string
  ) => void;
  logout: () => void;
}

const UserContext = createContext<UserType | null>(null);
//const UserContext = createContext<User | undefined>(undefined);

export const userAuth = () => {
  const user = useContext(UserContext);
  // if(!user){
  //     const navigate=useNavigate();
  //     navigate('/Login');
  // }
  return user;
};

export const UserContextProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  const setUserInfo = (
    newUserId: string,
    newName: string,
    newPassword: string,
    newEmail: string
  ) => {
    setUserId(newUserId);
    setUserName(newName);
    setPassword(newPassword);
    setEmail(newEmail);
    setIsLogged(true);
  };
  const logout = () => {
    setUserId(null);
    setUserName(null);
    setPassword(null);
    setEmail(null);
    setIsLogged(false);
  };
  const contextValue: UserType = {
    userId,
    username,
    password,
    email,
    isLogged,
    setUserInfo,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
