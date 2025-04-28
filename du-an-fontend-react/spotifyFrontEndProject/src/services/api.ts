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

//Get top music
export const getTrackAPI = () => {
    const urlBackend = '/tracks/toptrack/';
    return axios.get<IBackendRes<ITrack[]>>(urlBackend);
}   
//Get top singer
export const getTopArtistAPI = () => {
    const urlBackend = '/artists/list/';
    return axios.get<IBackendRes<IArtist[]>>(urlBackend);
}
//Create playlist
export const createPlaylistAPI = (user_id:string, name:string) => {
    const urlBackend = '/playlists/create/';
    return axios.post<IBackendRes<IPlaylist>>(urlBackend,{user_id, name});
}
//Get playlist
export const getPlaylistAPI = (user_id: number) => {
    const urlBackend = `/playlists/list-playlist?user_id=${user_id}`;
    return axios.get<IBackendRes<IPlaylist>>(urlBackend);
}
//add to playlist
export const addToPlaylistAPI = (playlist_id:number, track_id:number) => {
    const urlBackend = '/playlist_detail/addtracktoplaylist/';
    return axios.post<IBackendRes<IPlaylist>>(urlBackend,{playlist_id, track_id});
}
