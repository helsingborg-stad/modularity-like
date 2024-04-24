import { Components } from "./components";
import GetPosts from "./getPosts";
import Render from "./render";
import { removePreloaders, noPostsFound } from "./helpers/likeHelpers";
import { Post } from "./post";

class RenderPosts {
    constructor(private components: Components, private container: HTMLElement) {
    }

    public render() {
        const getPostsInstance = new GetPosts(this.container);
        const postsPromise = getPostsInstance.getPosts();

        if (!postsPromise) {
            removePreloaders(this.container);
            noPostsFound(this.container);
            return;
        }

        postsPromise.then((posts: Post[]) => {
            if (posts) {
                new Render(posts, this.components, this.container);
            }
        });
    }
}

export default RenderPosts;