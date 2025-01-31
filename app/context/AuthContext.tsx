import { User } from "@/types/userType";
import { createContext, ReactNode, useState } from "react";
import * as SecureStore from 'expo-secure-store';




interface AuthContextType {
    username: string | null;
    setUsername: (username:string | null) => void,
    userId: number | null;
    setUserId: (userId:number | null) => void,
    setLogin: (user:User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({children}: {children:ReactNode})=> {
    const [username,setUsername] = useState<string | null>(null)
    const [userId,setUserId] = useState<number | null>(null)

    const setLogin = (user:User) => {
        setUsername(user.username)
      
        SecureStore.setItem("accessToken",user.accessToken)
        SecureStore.setItem("refreshToken",user.refreshToken)
        
        SecureStore.setItem("username",user.username)
     
        setUserId(user.id)
    }

    return <AuthContext.Provider value={{username,setUsername,userId,setUserId,setLogin}}>{children}</AuthContext.Provider>

}


export {AuthProvider,AuthContext}