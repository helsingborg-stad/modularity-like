import { LikedPosts } from "../like-posts";

export default interface StorageInterface {
    get(): LikedPosts;
    set(postId: string, postType: string): void;
}