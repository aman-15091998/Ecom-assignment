"use client"
import Link from "next/link";
import {toast} from "react-toastify";
import styles from "./components.module.css";
import { useAuth } from "~/context/AuthContext";
import { useState } from "react";
import { api } from "~/trpc/react";


export const Register=()=>{
    const {user, loginUser}=useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {isPending, mutateAsync} = api.user.createUser.useMutation();
    
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        let newUser=await mutateAsync({
          email,
          password,
          name,
        });
       loginUser(newUser);
       toast.success("Please verify your email");
      } catch (error:any) {
        const errorMessage = error.shape?.data?.zodError?.fieldErrors?.password?.[0] || "User is already registered";
        toast.error(String(errorMessage));
      }
    };     
    return (
        <div className={styles.registrationFormDiv}>
            <h1 className={styles.registrationHeading}>Create your account</h1>
            <form onSubmit={handleRegister}>
                <div className={styles.formElement}>
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} id="name" onChange={(e)=>{setName(e.target.value)}} required disabled={isPending}/>
                </div>
                <div className={styles.formElement}>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} id="email" onChange={(e)=>{setEmail(e.target.value)}} required disabled={isPending}/>
                </div>
                <div className={styles.formElement}>
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} id="password" onChange={(e)=>{setPassword(e.target.value)}} required disabled={isPending}/>
                </div>
                <button className={styles.registerBtn} disabled={isPending}>{isPending?"CREATING...":"CREATE ACCOUNT"}</button>
            </form>
            <div className={styles.loginRedirectDiv}>
                <p>Have an account? {isPending?"LOGIN":<Link href="/login">LOGIN</Link>}</p>
            </div>
        </div>
    )
}
