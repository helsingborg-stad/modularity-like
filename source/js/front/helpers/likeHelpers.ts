import { LikedPostsMeta } from "../like-posts";

export function decodeLikedPosts(encodedLikedPosts: string): LikedPostsMeta {
    const decodedLikedPosts = atob(encodedLikedPosts);
    const compactLikedPosts = JSON.parse(decodedLikedPosts);

    let likedPostsStructuredObject: LikedPostsMeta = {};
    for (const postType of Object.keys(compactLikedPosts)) {
        if (Array.isArray(compactLikedPosts[postType])) {
            compactLikedPosts[postType].forEach(id => {
                console.log(`Decoding liked post: ${id} of type ${postType}`);
                // likedPostsStructuredObject[id] = postType;
            });
        }
    }

    return likedPostsStructuredObject;
}