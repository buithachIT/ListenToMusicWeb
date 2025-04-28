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
        },
        result: T[]
        
    }
    interface IUser{
        isAuthenticated: boolean;
        user: {
            full_name: string;
            role_id: string;
            id: string;
            user_name: number;
            is_superuser: number;
        }
    }
    interface ILogin{
       access_token: string;
        user: {
            email: string;
            role_id: string;
            user_id: string;
            username: string;
            is_superuser: number;
        }
    }
    interface IRegister{
        _id: string;
        email: string;
        fullname: string;
    }
    interface IFetchAccount{
        user : IUser
    }
    interface ITrack{
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
        is_copyright : number;
        price : string;
        image_url : string;
        release_date : string;
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
        name: string;
        userid: string;
        
    }
}