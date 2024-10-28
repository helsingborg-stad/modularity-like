import { LikedPost, WpApiSettings } from "../like-posts";
import StorageInterface from "./storageInterface";

declare const wpApiSettings: any;

class UserStorage implements StorageInterface {
    private likedPosts: LikedPost[] = [];
    constructor(
        private wpApiSettings: WpApiSettings,
        private userId: number
    ) {
        this.fetchLikedPostsFromUserId();
    }

    private fetchLikedPostsFromUserId(): void {
        const endpoint = `${this.wpApiSettings.root}wp/v2/users/${this.userId}`;
        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-NONCE': this.wpApiSettings?.nonce ?? '',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch existing user data');
            }
            return response.json();
        })
        .then(user => {
            console.log(user);
        })
    }

    public get(): LikedPost[] {
        return [];
    }

    public set(postId: string, postType: string): void {
    }
}

export default UserStorage;