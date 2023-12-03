"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function page(){
    const router = useRouter();
    if(localStorage.getItem('loggedIn') != "true"){
      router.replace("/login")
  }
    useEffect(() => {
      router.replace("/manage/editor/new")
    }, [])
    
    return (<></>)
}