"use client"
import { Register } from "./_components/register";
import { useAuth } from "~/context/AuthContext";
import { EmailVerify } from "./_components/emailverification";
import Interest from "./interest/page";

export default function Home() {
  const {user, loginUser}=useAuth();
    if(user && !user.isVerified){
    return (<>
    <EmailVerify email={user.email}/>
    </>)
    }
    console.log(user);
    if(user)
      return (<Interest/>); 
    return (
      <Register/>
  );
}
