"use client"
import Link from "next/link"
import styles from "./links.module.css"
import NavbarLink from "./NavbarLink"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"

const Links = () => {

    const links = [
        {
            title: "Homepage",
            path: "/"
        },
    ]

    const {authenticated} = useContext(AuthContext)

    useEffect(()=>{

    }, [authenticated])


    return (
        <div className={styles.links}>
            {links.map((link => (
                <NavbarLink item={link} key={link.title}/>
            )))}{
                authenticated ? (
                    <>
                        <NavbarLink item={{title: "Leaderboard", path: "/leaderboard"}}/>
                        <NavbarLink item={{title: "Logout", path: "/logout"}}/>
                    </>
                ) : (
                    <NavbarLink item={{title: "Login", path: "/login"}}/>
                )
            }
        </div>
    )
}

export default Links;