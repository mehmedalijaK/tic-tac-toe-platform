import IAuthResponse from "./IAuthResponse";
import ILogin from "./ILogin";
import IRegister from "./IRegister";
import IUser from "./IUser";

export interface IAuthContext {
    authenticated: boolean;
    user: IUser | null
    loading: boolean;
    loginUser: (payload: ILogin) => Promise<IAuthResponse>;
    registerUser: (payload: IRegister) => Promise<Response>;
    logout: () => void;
    token: string | null;
}

