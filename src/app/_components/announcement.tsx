"use client"
import styles from "./components.module.css";

export const Announcement=()=>{

    return (
        <div className={styles.announcementDiv}>
            <span><i className="fa-solid fa-angle-left"></i></span><span>Get 10% off on business sign up</span><span><i className="fa-solid fa-angle-right"></i></span>
        </div>
    )
}