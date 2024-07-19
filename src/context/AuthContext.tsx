"use client"
import { User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null,
    loginUser: (user: User) => void;
    logoutUser: () => void;
  }

const useLocalStortage=(): [User | null, (user: User | null) => void]=>{
    const [user, setUser]=useState<User | null>(null);
    useEffect(()=>{
        const u=localStorage.getItem("user");
        if(u){
            setUser(JSON.parse(u));
        }
    }, []);
    useEffect(()=>{
        if(user)
            localStorage.setItem("user", JSON.stringify(user));
    }, [user]);
    
    return [user, setUser];
}
const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const AuthProvider:React.FC<{ children: React.ReactNode }>=({children})=>{
    const [user, setUser]=useLocalStortage();
    const loginUser = (user:User) => {setUser(user)}; 
    const logoutUser = () => {setUser(null)};
    return (
        <AuthContext.Provider value={{user, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>    
    )
}

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 