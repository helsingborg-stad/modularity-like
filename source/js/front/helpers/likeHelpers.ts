import { LikedPost } from "../like-posts";

export function decodeLikedPosts(encodedLikedPosts: string): LikedPost[] {
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