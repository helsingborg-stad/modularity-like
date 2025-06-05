import { LikedPostsMeta, StructuredLikedPosts } from "../like-posts";

class LikedPostsStructurer {
    public structure(likedPosts: LikedPostsMeta): StructuredLikedPosts {
        const strucuturedLikedPosts: StructuredLikedPosts = {};
        for (const id in likedPosts) {
            if (!strucuturedLikedPosts[likedPosts[id].website]) {
                strucuturedLikedPosts[likedPosts[id].website] = [];
            }

            strucuturedLikedPosts[likedPosts[id].website].push(likedPosts[id]);
        }

        return strucuturedLikedPosts;
    }
}

export default LikedPostsStructurer;