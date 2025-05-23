export {};

declare global {
  interface IBackendRes<T> {
    non_field_errors?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
    detail: string;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface IUser {
    isAuthenticated: boolean;
    fullname: string;
    role_id: number;
    id: number;
    user_name: string;
    is_superuser: number;
    url_avatar: string;
  }
  interface ILogin {
    access_token: string;
    user: {
      email: string;
      role_id: string;
      user_id: string;
      username: string;
      is_superuser: number;
    };
  }
  interface IRegister {
    _id: string;
    email: string;
    fullname: string;
  }
  interface IFetchAccount {
    user: IUser;
  }
  interface IUserList {
    id: number;
    user_name: string;
    fullname: string;
    email: string;
    phone: number;
    image_user: string;
    is_superuser: number;
    url_avatar: string;
    role: string;
  }
  interface ITrack {
    track_id: number;
    title: string;
    artist: {
      artist_id: number;
      name: string;
      popularity_score: number;
      gener: string;
      follower: number;
      avatar: string;
    };
    is_copyright: number;
    price: string;
    image_url: string;
    release_date: string;
    namemp3: string;
    listen: number;
    mv_url: string;
  }
  interface IArtist {
    artist_id: number;
    name: string;
    popularity_score: number;
    gener: string;
    follower: number;
    avatar: string;
  }
  interface IPlaylist {
    playlist_id: number;
    name: string;
    userid: string;
  }
}
