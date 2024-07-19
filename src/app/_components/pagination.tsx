"use client"
import styles from "./components.module.css";
export const Pagination=({page, setPage, startLimit, endLimit})=>{
    const directSelection=(e)=>{
        const p=Number(e.target.textContent);
        if(p<18 && p>0)
            setPage(p);
    }
    const goToPrevPage=()=>{
        if(page>1)
            setPage((prevPage)=>prevPage-1);
    }
    const goToNextPage=()=>{
        if(page<=17)
            setPage((prevPage)=>prevPage+1);
    }
    return (
        <div className={styles.paginationDiv}>
                <span className={styles.firstPage} onClick={()=>{setPage(1)}}><i className="fa-solid fa-angles-left"></i></span>
                <span className={styles.prevPage} onClick={goToPrevPage}><i className="fa-solid fa-chevron-left"></i></span>
                {(page<=endLimit && (page-3)>=startLimit)?(<span className={`${styles.pageSpan}`} onClick={directSelection}>{page-3}</span>):""}
               {(page<=endLimit && (page-2)>=startLimit)?(<span className={`${styles.pageSpan}`} onClick={directSelection}>{page-2}</span>):""}
                {(page<=endLimit && (page-1)>=startLimit)?(<span className={`${styles.pageSpan}`} onClick={directSelection}>{page-1}</span>):""}
                {(page<=endLimit && page>=startLimit)?(<p className={`${styles.currPageSpan}`} onClick={directSelection}>{page}</p>):""}
                {((page+1)<=endLimit && page>=startLimit)?(<span className={`${styles.pageSpan}`} onClick={directSelection}>{page+startLimit}</span>):""}
                {((page+2)<=endLimit && page>=startLimit)?(<span className={`${styles.pageSpan}`} onClick={directSelection}>{page+2}</span>):""}
                {((page+3)<=endLimit && page>=startLimit)?(<span className={`${styles.pageSpan}`} onClick={directSelection}>{page+3}</span>):""}
                <span className={styles.nextPage} onClick={goToNextPage} ><i className="fa-solid fa-chevron-right"></i></span>
                <span className={styles.lastPage} onClick={()=>{setPage(17)}}><i className="fa-solid fa-angles-right"></i></span>
            </div>
    )
}