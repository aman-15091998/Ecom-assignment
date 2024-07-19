"use client"
import { useAuth } from "~/context/AuthContext";
import styles from "./interest.module.css";
import { InterestCard } from "../_components/interestcard";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { Category } from "@prisma/client";
import Login from "../login/page";
import { Pagination } from "../_components/pagination";
const Interest=()=>{
    const {user, logoutUser, loginUser} = useAuth();
    const [page, setPage]=useState(1);
    const getCategories=api.category.getCategories.useQuery({page:page }, {enabled:false});
    const updateUserPreferences=api.user.updateUserPreferences.useMutation();
    const [categories, setCategories]=useState<Object | null>(null);
    useEffect(()=>{
        //getting page 
        async function setOrGetValues(){
            const res=await getCategories.refetch();
            if(!res.data) return;
            console.log(res);
            const arr=res.data.map(obj=>({name:obj.name}));
            setCategories(arr);
        }
        setOrGetValues();
        
    }, [page]);
    useEffect(()=>{
        async function updateUser(){  //updating the user in the database
            const updatedUser=await updateUserPreferences.mutateAsync({email:user?.email, preferences:user?.preferences});
        }
        updateUser();
    }, [user])
    if(!user) return <Login/>;
    return (
        <div className={styles.interestsFormDiv}>
            <span onClick={()=>{logoutUser()}}>Logout</span>
            <h1 className={styles.interestsHeading}>Please mark your interests!</h1>
            <h3 className={styles.interestsSubHeading}>We will keep you notified.</h3>
            <p className={styles.savedInterestHeading}>My saved interests!</p>
            <InterestCard categories={categories || []}/>
            <Pagination page={page} setPage={setPage} startLimit={1} endLimit={17}/>
        </div>
    )
}

export default Interest;