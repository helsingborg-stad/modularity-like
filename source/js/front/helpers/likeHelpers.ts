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

export function decodeLikedPosts(encodedLikedPosts: string): LikedPost[] | false {
    if (!encodedLikedPosts) {
        return false;
    }

    // Decode the encoded liked posts data from Base64
    const decodedLikedPosts = atob(encodedLikedPosts);

    // Parse the decoded liked posts data into a JavaScript object
    const compactLikedPosts = JSON.parse(decodedLikedPosts);

    if (Array.isArray(compactLikedPosts)) {
        // Convert back to original format
        const likedPosts = compactLikedPosts.map((item: { id: string, type: string }) => ({ id: item.id, type: item.type }));

        // Return the JavaScript object of liked posts
        return likedPosts;
    }

    return false;
}