import { LikedPostsMeta, LikedPosts, WpApiSettings } from "../like-posts";
import StorageInterface from "./storageInterface";

class LocalStorage implements StorageInterface {
	private localeStorageKey: string = 'liked-posts-v2';
	private likedPosts: LikedPostsMeta;

	constructor(
		private wpApiSettings: WpApiSettings,
		private currentBlogId: string
	) {
		this.likedPosts = this.sanitizeLikedPosts(JSON.parse(localStorage.getItem(this.localeStorageKey) || '{}'));
	}

    public get(): LikedPostsMeta {
        return this.likedPosts;
    }

    public set(postId: string, postType: string, blogId: string): void {
		let likedPostsIds = this.get();
		const key = `${blogId}-${postId}`;

		if (likedPostsIds[key]) {
			delete likedPostsIds[key];
		} else {
			likedPostsIds[key] = {
				postType: postType,
				blogId: blogId,
				postId: postId,
				likedAt: Date.now(),
				website: this.wpApiSettings.root
			};
		}

		localStorage.setItem(this.localeStorageKey, JSON.stringify(likedPostsIds));
		this.likedPosts = likedPostsIds;
	}

	// Sanitizes how old liked posts are stored in local storage.
	// This is for backwards compatibility with older versions of the plugin.
	private sanitizeLikedPosts(likedPosts: LikedPosts|LikedPostsMeta): any {

		const localLikedPosts: LikedPostsMeta = {};
		for (const id in likedPosts) {
			if (typeof likedPosts[id] !== 'string') {
				localLikedPosts[id] = likedPosts[id];
				continue;
			}

			const key = `${this.currentBlogId}-${id}`;

			localLikedPosts[key] = {
				postType: likedPosts[id],
				blogId: this.currentBlogId,
				postId: id,
				likedAt: Date.now(),
				website: this.wpApiSettings.root
			}
		}

		return localLikedPosts;
	}
}

export default LocalStorage;