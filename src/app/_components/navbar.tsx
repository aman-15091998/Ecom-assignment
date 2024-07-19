"use client";
import styles from "./components.module.css";
export const Navbar=()=>{
    return (
        <div className={styles.navDiv}>
            <div className={styles.infoDiv}>
                <p>Help</p>
                <p>Order & Returns</p>
                <p>Hi, John</p>
            </div>
            <div className={styles.menuDiv}>
                <h1 className={styles.brandName}>ECOMMERCE</h1>
                <ul className={styles.menuList}>
                   <li>Categories</li> 
                   <li>Sale</li>    
                   <li>Clearance</li>    
                   <li>New Stock</li> 
                   <li>Trending</li> 
                </ul>
                <div className={styles.sideMenu}>
                    <span className={styles.searchIcon}><i className="fa-solid fa-magnifying-glass"></i></span>
                    <span className={styles.cartIcon}><i className="fa-solid fa-cart-shopping"></i></span>
                </div>
            </div>
            {/* <h1>Navbar</h1> */}
        </div>
    )
}