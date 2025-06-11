import { LikedPosts, LikedPostsUserMeta } from "../like-posts";

export default interface StorageInterface {
    get(): LikedPosts|LikedPostsUserMeta;
    set(postId: string, postType: string, blogId: string): void;
}