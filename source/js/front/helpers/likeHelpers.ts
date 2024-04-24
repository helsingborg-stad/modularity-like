import { LikedPost } from "../likedPost";

export function getLikedPostsFromLocalStorage(): LikedPost[] {
    const likedPostsJson = localStorage.getItem('liked-posts');
    return likedPostsJson ? JSON.parse(likedPostsJson) : [];
}

export function getLikedPostLength(){
    return getLikedPostsFromLocalStorage().length;
}

export function generateEncodedLikedPostsParam() {
    const likedPosts = getLikedPostsFromLocalStorage();
    if (likedPosts.length == 0) {
        return false;
    }

    const compactLikedPosts = likedPosts.reduce((acc, post) => {
        if (!acc[post.type]) {
            acc[post.type] = [];
        }
        acc[post.type].push(post.id);
        return acc;
    }, {} as { [key: string]: string[] });

    const encodedLikedPosts = btoa(JSON.stringify(compactLikedPosts));

    return '?liked-posts=' + encodedLikedPosts;
}

export function decodeLikedPosts(encodedLikedPosts: string): LikedPost[] | [] {
    const decodedLikedPosts = atob(encodedLikedPosts);
    const compactLikedPosts = JSON.parse(decodedLikedPosts);
    
    const likedPosts = Object.entries(compactLikedPosts).reduce<{ id: string; type: string; }[]>((acc, [type, ids]) => {
        (ids as string[]).forEach((id) => {
            acc.push({ id, type });
        });
        return acc;
    }, []);

    return likedPosts;
}