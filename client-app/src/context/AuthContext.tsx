import IUser from "@/model/IUser";
import IRegister from "@/model/IRegister";
import { IAuthContext } from "@/model/IAuthContext";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ILogin from "@/model/ILogin";
import { sendGetMyselfUser, sendLoginRequestUser, sendRegisterRequestUser } from "@/api/auth/route";

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);


export const AuthProvider = ({children}: { children: JSX.Element | JSX.Element[] }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const getUser = async (token: string) => {
        const response = await sendGetMyselfUser(token);
        if (response.ok) {
            const user = (await response.json());
            console.log(user)
            user.token = token;
            return user;
        }
        return null;
    }

    const loginUser = async (payload : ILogin) => {
        const response = await sendLoginRequestUser(payload)
        const data = await response.json()

        if (response.ok && data) {
            localStorage.setItem("token", data.access_token);
            const userData = await getUser(data.access_token);
            console.log(userData);
            if (userData) {
                setUser(userData);
            console.log(data.access_token)
            setToken(data.access_token);
            }
        }
        return {response, data};
    }

    // const editUser = async (email: string, dateBirth: Date, name: string, lastName: string) => { 
    //     const response = await sendEditUserRequest(email, dateBirth, name, lastName, token as string)
    //     if(response.ok){
    //         const userData = await getUser(token as string);
    //         if (userData) {
    //             setUser(userData);
    //         }
    //     }
    //     return response;
    // }

    const registerUser = async (payload : IRegister) => {
        const response = await sendRegisterRequestUser(payload);
        return response;
    }

    useEffect(() => {

        const doStuff = async () => {
            const lsToken = localStorage.getItem("token");
            setToken(lsToken);
            if (lsToken) {
                const userData = await getUser(lsToken);
                if (userData) {
                    setLoading(false);
                    setUser(userData);
                }
            }
            setLoading(false);
        };

        doStuff().then(() => {
        });
    }, []);

    const logout = (): void => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        
    };

    return (
        <AuthContext.Provider value={{authenticated: !!user, user, loading, token, registerUser, loginUser, logout }}>
            {loading ? <p>Loading</p> : children}
        </AuthContext.Provider>
    )
}

export const ProtectedRoute = ({children}: { children: JSX.Element | JSX.Element[] }) => {
    const {authenticated} = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!authenticated)
            router.push("/login");
    }, [authenticated]);

    return children;
};

export default AuthContext;