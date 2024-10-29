import { LikedPosts } from "../like-posts";
import StorageInterface from "./storageInterface";

class LocalStorage implements StorageInterface {
	private localeStorageKey: string = 'liked-posts-v2';
    public get(): LikedPosts {
        const likedPostsJson = localStorage.getItem(this.localeStorageKey);
        return likedPostsJson ? JSON.parse(likedPostsJson) : {};
    }

    public set(postId: string, postType: string): void {
		let likedPostsIds = this.get();
		if (likedPostsIds[postId]) {
			delete likedPostsIds[postId];
		} else {
			likedPostsIds[postId] = postType;
		}

		localStorage.setItem(this.localeStorageKey, JSON.stringify(likedPostsIds));
	}
}

export default LocalStorage;