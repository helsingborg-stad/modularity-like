import GetPosts from './front/getPosts';
import Like from './front/like';
import Render from './front/render';

const LikeInstance = new Like();
const RenderInstance = new Render(likedPostsComponents, LikeInstance);
const GetPostsInstance = new GetPosts(RenderInstance);

console.log(GetPostsInstance);
