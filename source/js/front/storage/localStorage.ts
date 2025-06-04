import { LikedPostMeta, LikedPosts } from "../like-posts";
import StorageInterface from "./storageInterface";

class LocalStorage implements StorageInterface {
	private localeStorageKey: string = 'liked-posts-v2';
	private likedPosts: LikedPostMeta;

	constructor(private blogId: string) {
		this.likedPosts = this.sanitizeLikedPosts(JSON.parse(localStorage.getItem(this.localeStorageKey) || '{}'));
	}

    public get(): LikedPostMeta {
        return this.likedPosts;
    }

    public set(postId: string, postType: string): void {
		let likedPostsIds = this.get();
		const key = `${this.blogId}-${postId}`;

		if (likedPostsIds[key]) {
			delete likedPostsIds[key];
		} else {
			likedPostsIds[key] = {
				postType: postType,
				blogId: this.blogId,
				postId: postId,
				likedAt: Date.now()
			};
		}

		localStorage.setItem(this.localeStorageKey, JSON.stringify(likedPostsIds));
		this.likedPosts = likedPostsIds;
	}

	// Sanitizes how old liked posts are stored in local storage.
	private sanitizeLikedPosts(likedPosts: LikedPosts|LikedPostMeta): any {

		const localLikedPosts: LikedPostMeta = {};
		for (const id in likedPosts) {
			if (typeof likedPosts[id] !== 'string') {
				localLikedPosts[id] = likedPosts[id];
				continue;
			}

			const key = `${this.blogId}-${id}`;

			localLikedPosts[key] = {
				postType: likedPosts[id],
				blogId: this.blogId,
				postId: id,
				likedAt: Date.now()
			}
		}

		return localLikedPosts;
	}
}

export default LocalStorage;