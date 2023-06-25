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
    color: string,
    followers_count: number | undefined,
    following_count: number | undefined,
    posts_count: number | undefined
}

type Auth = {
    token: string,
    user: User
};

type PostFile = {
    file: string,
    thumbnail?: string
}

type Post = {
    comments_count: number,
    created_at: string,
    id: number,
    files: PostFile[],
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

type Message = {
    content: string,
    is_post: boolean,
    room: number,
    timestamp: string,
    user: number
}

type ChatResponse = {
    id: number,
    last_message: Message,
    user: User
}
