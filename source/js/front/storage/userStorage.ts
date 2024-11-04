import { LikedPosts, WpApiSettings } from "../like-posts";
import StorageInterface from "./storageInterface";

declare const wpApiSettings: any;

class UserStorage implements StorageInterface {
    private likedPosts: LikedPosts = {};
    private userEndpoint: string = '';

    constructor(
        private wpApiSettings: WpApiSettings,
        private userId: number,
        likedPostsMeta: any
    ) {
        this.userEndpoint = `${this.wpApiSettings.root}wp/v2/users/${this.userId}`;
        this.likedPosts = likedPostsMeta;
    }

    public get(): LikedPosts {
        return this.likedPosts;
    }

    public set(postId: string, postType: string) {
        let runtimeLikedPosts = this.get();
        if (runtimeLikedPosts[postId]) {
            delete runtimeLikedPosts[postId];
        } else {
            runtimeLikedPosts[postId] = postType;
        }

        fetch(this.userEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-NONCE': wpApiSettings?.nonce ?? '',
            },
            body: JSON.stringify({
                meta: {
                    likedPosts: runtimeLikedPosts
                }
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user data');
            } else {
                return response.json();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

export default UserStorage;
