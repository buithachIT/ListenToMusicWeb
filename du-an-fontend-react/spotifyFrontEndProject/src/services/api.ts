import axios from "../services/axios.customize"

//Login
export const loginAPI = (user_name: string, password: string) => {
    const urlBackend = "/login/";
    return axios.post(urlBackend, { user_name, password}); 
}

//Register
export const registerAPI = (email: string, fullName: string, phone: string,  password: string) => {
    const urlBackend = '/register/';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, fullName, phone, password });
}

//Fetch account
export const fetchAccountAPI = () => {
    const urlBackend = '/api/v1/auth/account';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
}
