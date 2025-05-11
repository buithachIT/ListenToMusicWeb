import axios from "../services/axios.customize";

//Login
export const loginAPI = (user_name: string, password: string) => {
  const urlBackend = "/users/login/";
  return axios.post(urlBackend, { user_name, password });
};

//Register
export const registerAPI = (
  user_name: string,
  fullname: string,
  phone: string,
  password: string
) => {
  const urlBackend = "/users/register/";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    user_name,
    fullname,
    phone,
    password,
  });
};
export const logoutAPI = () => {
  const urlBackend = "/users/logout/";
  return axios.post<IBackendRes<IFetchAccount>>(urlBackend);
};
//Fetch account
export const fetchAccountAPI = () => {
  const urlBackend = "/users/profile/";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};
//Get all users
export const getAllUsersAPI = () => {
  const urlBackend = "/users/list/";
  return axios.get<IBackendRes<IUserList[]>>(urlBackend);
};
//Create user
export const createUserAPI = (
  fullname: string,
  password: string,
  email: string,
  phone: string
) => {
  const urlBackend = "/users/register/";
  return axios.post<IBackendRes<IUserList>>(urlBackend, {
    user_name: fullname,
    fullname,
    password,
    email,
    phone,
  });
};

//Update user
export const updateUserAPI = (
  id: number,
  fullname: string,
  email: string,
  phone: string
) => {
  const urlBackend = `/users/${id}/update/`;
  return axios.put<IBackendRes<IUserList>>(urlBackend, {
    fullname,
    email,
    phone,
  });
};
//Delete user
export const deleteUserAPI = (id: number) => {
  const urlBackend = `/users/${id}/delete/`;
  return axios.delete<IBackendRes<IUserList>>(urlBackend);
};
//Get top music
export const getTrackAPI = () => {
  const urlBackend = "/tracks/list/";
  return axios.get<IBackendRes<ITrack[]>>(urlBackend);
};
//get all tracks
export const getAllTracksAPI = () => {
  const urlBackend = "/tracks/list/";
  return axios.get<IBackendRes<ITrack[]>>(urlBackend);
};
//Create track
export const createTrackAPI = (
  title: string,
  artist_id: number,
  album_id: number | null,
  namemp3: string,
  price?: number,
  image_url?: string,
  release_date?: string,
  is_copyright?: number,
  file?: File,
  listen?: number
) => {
  const urlBackend = "/tracks/create/";
  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist_id", artist_id.toString());
  if (album_id) formData.append("album_id", album_id.toString());
  formData.append("namemp3", namemp3);
  if (price) formData.append("price", price.toString());
  if (image_url) formData.append("image_url", image_url);
  if (release_date) formData.append("release_date", release_date);
  if (is_copyright !== undefined)
    formData.append("is_copyright", is_copyright.toString());
  if (file) formData.append("mp3", file);
  formData.append("listen", (listen || 0).toString());

  return axios.post<IBackendRes<ITrack>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Get top singer
export const getTopArtistAPI = () => {
  const urlBackend = "/artists/list/";
  return axios.get<IBackendRes<IArtist[]>>(urlBackend);
};
//Create playlist
export const createPlaylistAPI = (user_id: string, name: string) => {
  const urlBackend = "/playlists/create/";
  return axios.post<IBackendRes<IPlaylist>>(urlBackend, { user_id, name });
};
//Get playlist
export const getPlaylistAPI = (user_id: number) => {
  const urlBackend = `/playlists/list-playlist?user_id=${user_id}`;
  return axios.get<IBackendRes<IPlaylist[]>>(urlBackend);
};
//add to playlist
export const addToPlaylistAPI = (playlist_id: number, track_id: number) => {
  const urlBackend = "/playlist_detail/addtracktoplaylist/";
  return axios.post<IBackendRes<IPlaylist>>(urlBackend, {
    playlist_id,
    track_id,
  });
};
//get tracks from playlist
export const getPlaylistTracksAPI = (playlist_id: number) => {
  const urlBackend = `/playlists/${playlist_id}/`;
  return axios.get<IBackendRes<ITrack[]>>(urlBackend);
};
//Delete track
export const deleteTrackAPI = (id: number) => {
  const urlBackend = `/tracks/delete/${id}/`;
  return axios.delete<IBackendRes<ITrack>>(urlBackend);
};
//Update track
export const updateTrackAPI = async (
  trackId: number,
  title: string,
  artistId: number,
  albumId: number | null,
  namemp3: string,
  price: number,
  imageUrl: string,
  releaseDate: string | undefined,
  isCopyright: number,
  mp3File?: File,
  listen?: number,
  mvFile?: File
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist_id", artistId.toString());
  if (albumId) formData.append("album_id", albumId.toString());
  formData.append("namemp3", namemp3);
  formData.append("price", price.toString());
  formData.append("image_url", imageUrl);
  if (releaseDate) formData.append("release_date", releaseDate);
  formData.append("is_copyright", isCopyright.toString());
  if (listen) formData.append("listen", listen.toString());
  if (mp3File) formData.append("mp3", mp3File);
  if (mvFile) formData.append("mv", mvFile);

  return await axios.put(`/tracks/update/${trackId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Create artist
export const createArtistAPI = (
  name: string,
  gener?: string,
  popularity_score?: number,
  follower?: number,
  avatar?: string,
  file?: File
) => {
  const urlBackend = "/artists/create/";
  const formData = new FormData();
  formData.append("name", name);
  if (gener) formData.append("gener", gener);
  if (popularity_score)
    formData.append("popularity_score", popularity_score.toString());
  if (follower) formData.append("follower", follower.toString());
  if (avatar) formData.append("avatar", avatar);
  if (file) formData.append("file", file);

  return axios.post<IBackendRes<IArtist>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Update artist
export const updateArtistAPI = (
  artist_id: number,
  name?: string,
  gener?: string,
  popularity_score?: number,
  follower?: number,
  avatar?: string,
  file?: File
) => {
  const urlBackend = `/artists/update/${artist_id}/`;
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (gener) formData.append("gener", gener);
  if (popularity_score)
    formData.append("popularity_score", popularity_score.toString());
  if (follower) formData.append("follower", follower.toString());
  if (avatar) formData.append("avatar", avatar);
  if (file) formData.append("file", file);

  return axios.put<IBackendRes<IArtist>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Delete artist
export const deleteArtistAPI = (artist_id: number) => {
  const urlBackend = `/artists/delete/${artist_id}/`;
  return axios.delete<IBackendRes<IArtist>>(urlBackend);
};

//Search tracks
export const searchTracksAPI = (query: string) => {
  const urlBackend = `/tracks/search/?q=${encodeURIComponent(query)}`;
  return axios.get<IBackendRes<ITrack[]>>(urlBackend);
};

//Search by artist
export const searchByArtistAPI = (query: string) => {
  const urlBackend = `/tracks/search-by-artist/?q=${encodeURIComponent(query)}`;
  return axios.get<IBackendRes<ITrack[]>>(urlBackend);
};

//Get tracks by artist ID
export const getTracksByArtistAPI = (artistId: number) => {
  const urlBackend = `/tracks/getbyartist/${artistId}/`;
  return axios.get<ITrack[]>(urlBackend);
};
