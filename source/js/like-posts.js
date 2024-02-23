import GetPosts from './front/getPosts';
import Like from './front/like';
import { initializeLikedCounter } from "./front/likedCounter";
import { initializeShare } from './front/share';

initializeLikedCounter(likedPostsComponents.counterElement);
const LikeInstance = new Like();
const GetPostsInstance = new GetPosts(likedPostsComponents);
initializeShare();
