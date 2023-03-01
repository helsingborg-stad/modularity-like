// Global variable likedPostsComponents from WordPress localize script.
declare const likedPostsComponents: any

interface Post {
    id: string,
    type: string,
    _embedded?: any
    link: string,
    image?: {source_url: string},
    title: {rendered: string},
    excerpt: {rendered: string}
}

interface LikedPost {
    id: string|number,
    type: string
}