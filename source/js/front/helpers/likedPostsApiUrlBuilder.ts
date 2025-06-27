import { LikedPostMeta, LikedPostsMeta, WpApiSettings } from "../like-posts";

class LikedPostsApiUrlBuilder {
    constructor(private wpApiSettings: WpApiSettings) {}

    public build(likedPosts: LikedPostsMeta, appearance: string, postTypes?: string[]): string {
        let postIds: string[] = [];
        for (const postId in likedPosts) {
            if (!postTypes || postTypes.includes(likedPosts[postId].postType)) {
                postIds.push(postId);
            }
        }

        return `${this.wpApiSettings.root}like/v1/ids=${postIds.join(',')}?html&appearance=${appearance}`;
    }
}

export default LikedPostsApiUrlBuilder;