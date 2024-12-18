import { LikedPosts } from "../like-posts";
import StorageInterface from "./storageInterface";

class LocalStorage implements StorageInterface {
	private localeStorageKey: string = 'liked-posts-v2';
	private likedPosts: null|LikedPosts = null;

    public get(): LikedPosts {
		if (!this.likedPosts) {
			const likedPostsJson = localStorage.getItem(this.localeStorageKey);
			this.likedPosts = likedPostsJson ? JSON.parse(likedPostsJson) : {};
		}

        return this.likedPosts as LikedPosts;
    }

    public set(postId: string, postType: string): void {
		let likedPostsIds = this.get();
		if (likedPostsIds[postId]) {
			delete likedPostsIds[postId];
		} else {
			likedPostsIds[postId] = postType;
		}

		localStorage.setItem(this.localeStorageKey, JSON.stringify(likedPostsIds));
		this.likedPosts = likedPostsIds;
	}
}

export default LocalStorage;