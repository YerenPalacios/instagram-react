import { useState } from "react";
import Header from "../components/haeader/header";
import {ProfileForm, PasswordForm} from "../components/profileForm/profileForm";
import ProfilesView from "../components/profilesView/ProfilesView";


export default function Profile(){
    const [actual, setActual] = useState(1)
    var setting = actual === 1 ?<ProfileForm/>:
        actual === 2? <PasswordForm/>:null

    const handleActual = (num) => {
        setActual(num)
    }

    return(
        <>
            <Header/> 
            <br />
            <ProfilesView/>
        </>
    )
}