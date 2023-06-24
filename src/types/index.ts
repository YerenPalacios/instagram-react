type User = {
    description: string,
    email: string
    is_following: boolean,
    id: number,
    image: string,
    is_active: boolean,
    is_superuser: boolean,
    last_login: null | string,
    name: string,
    phone: string,
    username: string,
    color: string
}

type Auth = {
    token: string,
    user: User
};

type Image = {
    image: string
}

type Post = {
    comments_count: number,
    created_at: string,
    id: number,
    images: Image[],
    is_liked: boolean,
    is_saved: boolean,
    likes_count: number,
    text: string,
    user: User
}

type PostComment = {
    created_at: string,
    id: number,
    parent: null,
    post: number,
    text: string,
    user: User,
    likes_count: number,
    is_liked: boolean
}

type ChatResponse = {
    id: number,
    last_message: string,
    user: User
}
