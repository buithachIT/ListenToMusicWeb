import axios from "../services/axios.customize"

//Login
export const loginAPI = (user_name: string, password: string) => {
    const urlBackend = "/users/login/";
    return axios.post(urlBackend, { user_name, password}); 
}

//Register
export const registerAPI = (user_name: string, fullname: string, phone: string,  password: string) => {
    const urlBackend = '/users/register/';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { user_name, fullname, phone, password });
}

//Fetch account
export const fetchAccountAPI = () => {
    const urlBackend = '/users/profile/';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};

//Get music
export const getTrackAPI = () => {
    const urlBackend = '/tracks/list/';
    return axios.get<IBackendRes<ITrack[]>>(urlBackend);
}