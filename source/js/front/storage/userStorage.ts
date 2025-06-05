import { LikedPostsMeta, LikedPosts, WpApiSettings } from "../like-posts";
import StorageInterface from "./storageInterface";

declare const wpApiSettings: any;

class UserStorage implements StorageInterface {
    private likedPosts: LikedPostsMeta = {};
    private userEndpoint: string = '';

    constructor(
        private wpApiSettings: WpApiSettings,
        private userId: number,
        likedPostsMeta: any,
        private blogId: string | null = null
    ) {
        this.userEndpoint = `${this.wpApiSettings.root}wp/v2/users/${this.userId}`;
        this.likedPosts = this.sanitizeLikedPostsMeta(likedPostsMeta);
    }

    public get(): LikedPostsMeta {
        return this.likedPosts;
    }

    public set(postId: string, postType: string) {
        if (!this.blogId) return;

        const key = `${this.blogId}-${postId}`;
        const runtimeLikedPosts = this.get();

        if (runtimeLikedPosts[key]) {
            delete runtimeLikedPosts[key];
        } else {
            runtimeLikedPosts[key] = {
                postType: postType,
                blogId: this.blogId,
                postId: postId,
                likedAt: Date.now(),
                website: this.wpApiSettings.root
            };
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
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

   private sanitizeLikedPostsMeta(likedPostsMeta: any): LikedPostsMeta {
        if (!likedPostsMeta || typeof likedPostsMeta !== 'object') return {};

        return Object.fromEntries(
            Object.entries(likedPostsMeta).filter(([_, value]) =>
                value &&
                typeof value === 'object' &&
                'postId' in value &&
                'blogId' in value &&
                'postType' in value &&
                'likedAt' in value
            )
        ) as LikedPostsMeta;
    }
}

export default UserStorage;