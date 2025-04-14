export {};

declare global {
    interface IBackendRes<T> {
        non_field_errors?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
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
            user_id: string;
            user_name: number;
        }
    }

    interface ILogin{
        access_token: string;
        user: {
            email: string;
            role_id: string;
            user_id: string;
            username: string;
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
        is_copyright : string;
        price : string;
        image_url : string;
        release_date : string;
        namemp3 : string;
    }
}