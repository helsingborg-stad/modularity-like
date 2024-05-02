import { getLikedPostsFromLocalStorage, decodeLikedPosts } from "./helpers/likeHelpers";
import { Post, PostDetailsObject } from "./post";

class GetPosts {
	constructor(private container: HTMLElement) {}

	public getPosts(): Promise<Post[]>|null {
		const urlParams = new URLSearchParams(window.location.search);
		const sharedPosts = urlParams.get('liked-posts');

		const posts = sharedPosts ? decodeLikedPosts(sharedPosts) : getLikedPostsFromLocalStorage();

		return this.fetchPosts(this.filterPosts(posts));
	}

	private fetchPosts(postIds: Array<PostDetailsObject>): Promise<Post[]>|null {
        let posts = postIds.map((post: PostDetailsObject) => {
            return post.id;
        });

        return posts.length > 0 ? this.getPostsFromEndpoint(posts.join(',')) : null;
    }

    private getPostsFromEndpoint(posts: string): Promise<Post[]> {
		const url = window.location.origin;
        return new Promise((resolve: any, reject: any) => {
            fetch(`${url}/wp-json/like/v1/id=${posts}`)
            .then(response => {
                if (!response.ok) {
					return null;
                }

                return response.json();
                
            }).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

	private filterPosts(posts: PostDetailsObject[]) {
		if (this.container.hasAttribute('data-js-like-posts-post-types')) {
			const postTypes = JSON.parse(this.container.getAttribute('data-js-like-posts-post-types') || '[]');
			posts = posts.filter((post: PostDetailsObject) => {
				return postTypes.includes(post.type)
			});
		}
		return posts;
	}
}

export default GetPosts;
