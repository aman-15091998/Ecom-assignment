"use client"
import Link from "next/link";
import styles from "./login.module.css";
import {toast} from "react-toastify";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { EmailVerify } from "../_components/emailverification";
import Interest from "../interest/page";

const Login=()=>{
    const {user, loginUser}=useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {refetch, isFetching} = api.user.getUserByEmailPassword.useQuery({ email: email, password: password }, { enabled: false});
    
    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res=await refetch(); 
        // console.log(res);
        if(!isFetching && res.data){
            if(res.data && !res.data.isVerified){
                toast.warning("Please verify your email!");
            }else{
                toast.success("Sigin successful!");
            }
            loginUser(res.data);
        }else if(isFetching==false)
            toast("Incorrect credentials!");
    };
    if(user && !user.isVerified){
        return (<>
        <EmailVerify email={user.email}/>
        </>)
    }
    if(user)
        return (<Interest/>); 
    return (
        <div className={styles.loginFormDiv}>
            <h1 className={styles.loginHeading}>Login</h1>
            <h3 className={styles.loginSubHeading}>Welcome back to ECOMMERCE</h3>
            <p className={styles.infoPara}>The next gen business marketplace</p>
            <form onSubmit={loginHandler}>
                <div className={styles.formElement}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={(e)=>{setEmail(e.target.value)}} required disabled={isFetching}/>
                </div>
                <div className={styles.formElement}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={(e)=>{setPassword(e.target.value)}} required disabled={isFetching}/>
                </div>
                <button className={styles.loginBtn} disabled={isFetching}>{isFetching?"LOGGING IN...":"LOGIN"}</button>
            </form>
            <div className={styles.registerRedirectDiv}>
                <p>Didn't have an account? <Link href="/">SIGN UP</Link></p>
            </div>
        </div>
    )
}
export default Login;