import { LikedPost } from "../like-posts";

export default interface StorageInterface {
    get(): LikedPost[];
    set(postId: string, postType: string): void;
}