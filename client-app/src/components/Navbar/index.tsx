import Link from "next/link"
import Links from "./Links"
import styles from "./navbar.module.css"

const Navbar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logo}>TIC TAC TOE <br/> LEGENDS</div>
            <Links/>
        </div>
    )
}

export default Navbar