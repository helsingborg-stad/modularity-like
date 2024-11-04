import { LikedPosts } from "../like-posts";

export function decodeLikedPosts(encodedLikedPosts: string): LikedPosts {
    const decodedLikedPosts = atob(encodedLikedPosts);
    const compactLikedPosts = JSON.parse(decodedLikedPosts);

    let likedPostsStructuredObject: LikedPosts = {};
    for (const postType of Object.keys(compactLikedPosts)) {
        if (Array.isArray(compactLikedPosts[postType])) {
            compactLikedPosts[postType].forEach(id => {
                likedPostsStructuredObject[id] = postType;
            });
        }
    }

    return likedPostsStructuredObject;
}