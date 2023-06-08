import GetPosts from './front/getPosts';
import Like from './front/like';
import Render from './front/render';
import { initializeShare } from './front/share';

const LikeInstance = new Like();
const RenderInstance = new Render(likedPostsComponents);
const GetPostsInstance = new GetPosts(RenderInstance);
initializeShare();
