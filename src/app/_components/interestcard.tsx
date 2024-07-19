"use client"
import { useAuth } from "~/context/AuthContext";
import styles from "./components.module.css";
export const InterestCard=({categories})=>{
    const {user, loginUser}=useAuth();
    const handleToggle=async (e)=>{
        // update user state
        if(!user) return;
        const userCopy={...user};
        const prefIndex=userCopy.preferences?.indexOf(e.target.value);
        if(prefIndex==-1)
            userCopy.preferences.push(e.target.value);
        else
            userCopy.preferences?.splice(prefIndex, 1);
        loginUser(userCopy);
    }
    return (
        <form >
                {categories.map((obj, index)=>(
                    <div className={styles.categoryFormElement} key={index}>
                    <input type="checkbox" id={obj.name} value={obj.name} checked={user?.preferences.includes(obj.name)} onChange={handleToggle}/>
                    <label htmlFor={obj.name}>{obj.name}</label>
                </div>))}
            </form>
    )
}