import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_CURRENT_USER } from "./TokenContextAPI/TokenContextAPI";
import { useLazyQuery} from "@apollo/client";






export const TokenContext = createContext<{
    userId?: string;
    userType?: string;
    organizationId?: string;
    userName?: string;
    refetchUser?: () => void;
}>({});


export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState<string>();
    const [userType, setUserType] = useState<string>();
    const [organizationId, setOrganizationId] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const navigate = useNavigate();
useEffect(() =>{
    const token = localStorage.getItem('token');
    if(!token){
        setUserId("");
        setUserName("");
        setUserType("")
        navigate('/signin')
    }
},[localStorage.getItem('token')]);
const [getUser] = useLazyQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.currentUser) {
        setUserId(data.currentUser.userId);
        setUserType(data.currentUser.userType);
        setUserName(data.currentUser.userName);
        if (data.currentUser.userType === 'organization') {
          setOrganizationId(data.currentUser.userId);
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching user", error);
      localStorage.removeItem("token");
      navigate("/signin");
    }
  });
  const refetchUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser();
    }
  };

    return (
        <TokenContext.Provider value={{ userId, userType, organizationId, userName , refetchUser}}>
            {children}
        </TokenContext.Provider>
    );
};
