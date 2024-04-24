import { Components } from "./components";
import GetPosts from "./getPosts";
import Render from "./render";

class RenderPosts {
    constructor(private components: Components, private container: HTMLElement) {
    }

    public render() {
        const getPostsInstance = new GetPosts(this.container);
        const postsPromise = getPostsInstance.getPosts();
        postsPromise.then((posts: any) => {
            new Render(posts, this.components, this.container);
        });
    }
}

export default RenderPosts;