import { LikedPostMeta, StructuredLikedPosts } from "../like-posts";

class LikedPostsApiUrlBuilder {
    public build(structuredLikedPosts: StructuredLikedPosts, appearance: string, postTypes?: string[]): string[] {
        const urls: string[] = [];
        for (const website in structuredLikedPosts) {
            const url = this.buildUrl(website, structuredLikedPosts[website], appearance, postTypes);

            if (url) {
                urls.push(url);
            }
        }

        return urls;
    }

    public buildUrl(website: string, posts: LikedPostMeta[], appearance: string, postTypes?: string[]): string|false {
        const postIdsString = posts.filter(post => !postTypes || postTypes.includes(post.postType)).map(post => post.postId).join(',');

        if (postIdsString.length === 0) {
            return false;
        }

        return `${website}like/v1/ids=${postIdsString}?html&appearance=${appearance}`;
    }
}

export default LikedPostsApiUrlBuilder;