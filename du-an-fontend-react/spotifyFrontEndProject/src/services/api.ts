import axios from "../services/axios.customize"

//Login
export const loginAPI = (user_name: string, password: string) => {
    const urlBackend = "/users/login/";
    return axios.post(urlBackend, { user_name, password}); 
}

//Register
export const registerAPI = (user_name: string, fullName: string, phone: string,  passwordhash: string) => {
    const urlBackend = '/users/register/';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { user_name, fullName, phone, passwordhash });
}

//Fetch account
export const fetchAccountAPI = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return { data: null, message: "No token found" };
    }

    // Giả lập response giống như BE thật
    return {
        data: {
            user: {
                user_id: 5,
                full_name: "Bùi Thạch",
                user_name: "buithach.it@gmail.com",
                role_id: 1
            }
        }
    };
};

//Get music
export const getMusicAPI = () => {
    const urlBackend = '/music/list/';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
}