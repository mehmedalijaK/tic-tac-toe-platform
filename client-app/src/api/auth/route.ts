import ILogin from "@/model/ILogin";
import { API_GET_MYSELF_USER, API_SIGN_IN_USER, API_SIGN_UP_USER } from "../constants";
import IRegister from "@/model/IRegister";

export const sendLoginRequestUser = async (payload : ILogin) => {
    return (await fetch(API_SIGN_IN_USER, {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    }));
};

export const sendRegisterRequestUser = async (payload : IRegister) => {
    return (await fetch(API_SIGN_UP_USER, {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    }));
};

export const sendGetMyselfUser = (token: string) =>
    fetch(API_GET_MYSELF_USER, {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', "Authorization": "Bearer " + token},
});