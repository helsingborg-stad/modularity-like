import { getLikedPostsFromLocalStorage, decodeLikedPosts } from "./helpers/likeHelpers";

interface PostDetailsObject {
    id: string;
    type: string;
}

class GetPosts {
	constructor(private container: HTMLElement) {}

	public getPosts(): Promise<any> {
		const urlParams = new URLSearchParams(window.location.search);
		const sharedPosts = urlParams.get('liked-posts');

		const posts = sharedPosts ? decodeLikedPosts(sharedPosts) : getLikedPostsFromLocalStorage();

		return this.fetchPosts(this.filterPosts(posts));
	}

	private fetchPosts(postIds: Array<any>): Promise<any> {
        let posts = postIds.map((post: PostDetailsObject) => {
            return post.id;
        });

        return this.getPostsFromEndpoint(posts.join(','));
    }

    private getPostsFromEndpoint(posts: string): Promise<any> {
		const url = window.location.origin;
        return new Promise((resolve: any, reject: any) => {
            fetch(`${url}/wp-json/like/v1/id=${posts}`)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch liked posts');
                }

                return response.json();
                
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.error('Error fetching liked posts:', error);
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
