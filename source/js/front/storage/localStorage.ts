import { LikedPost } from "../like-posts";
import StorageInterface from "./storageInterface";

class LocalStorage implements StorageInterface {
    public get(): LikedPost[] {
        const likedPostsJson = localStorage.getItem('liked-posts');
        return likedPostsJson ? JSON.parse(likedPostsJson) : [];
    }

    public set(postId: string, postType: string): void {
		let likedPostIds = this.get();

		const index = likedPostIds.findIndex((item: { id: string, type: string }) => item.id === postId && item.type === postType);
		if (index === -1) {
			likedPostIds.push({ id: postId, type: postType });
		} else {
			likedPostIds.splice(index, 1);
		}

		localStorage.setItem('liked-posts', JSON.stringify(likedPostIds));
	}
}

export default LocalStorage;