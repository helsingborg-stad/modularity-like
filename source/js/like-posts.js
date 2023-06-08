import GetPosts from './front/getPosts';
import Like from './front/like';
import { initializeShare } from './front/share';

const LikeInstance = new Like();
const GetPostsInstance = new GetPosts(likedPostsComponents);
initializeShare();
