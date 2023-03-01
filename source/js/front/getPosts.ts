import Render from './render';

class GetPosts {

    private posts:Post[]
    private renderInstance: Render

    constructor(RenderInstance:Render) {
        this.getPosts();
        this.posts = [];
        this.renderInstance = RenderInstance;
    }

    getPosts() {
        if (!document.querySelector('[js-like-container]')) {
            return;
        }

        if (this.posts) {
            return this.renderPosts();
        }

        let items = this.handleEndpoints() ?? "";
        const wantedPostTypes = this.getContainersPostTypes();

        let urls = [];
        if (items) {
            for (const key in items) {
                if (items.hasOwnProperty(key) && wantedPostTypes.includes(key)) {
                    urls.push(this.getUrls(key, items[key]));
                }
            }
        }
        if (urls.length > 0) {
            this.fetchPosts(urls);
        }
    }

    fetchPosts(urls:string[]) {
        const requests = urls.map(url => fetch(url));
        Promise.all(requests)
            .then(responses => {
                const jsonPromises = responses.map(response => response.json());
                return Promise.all(jsonPromises);
            })
            .then(data => {
                const postsArray = [].concat(...data);
                this.posts = postsArray;
                this.renderPosts();
            })
            .catch(error => {
                console.log(error);
            })
    }

    getUrls(key:string, likedPosts:LikedPost[]) {
        let idString = '';
            likedPosts.forEach((id, index) => {
                idString += id.id;
                if (index < likedPosts.length - 1) {
                    idString += ',';
                }
            });
        const endpoint = `https://localhost/wptest/wp-json/wp/v2/${key === 'post' ? 'posts' : key}?_embed&include=${idString}`;
        return endpoint;
    }

    getContainersPostTypes():string[] {
        const containers = document.querySelectorAll('[js-like-container]');
        let arr:string[] = [];
        containers.forEach((container) => {
            if (!container.hasAttribute('js-post-types')) {
                return;
            }
            const jsPostTypesElement = container.getAttribute('js-post-types')
            if( jsPostTypesElement === null ) return []
            const postTypes:string[] = JSON.parse(jsPostTypesElement);
            postTypes.forEach((postType) => {
                if (!arr.includes(postType)) {
                    arr.push(postType);
                }
            });
        });
        
        return arr;
    }

    /**
     * sorts the array of liked posts in local storage based on their type (object parameter)
     * @returns An object with the keys of the different types of posts and the values being an array
     * of the posts of that type.
     */
    // [{}, {}] {post: [{}, {}]}
    handleEndpoints() {
        let posts = this.getLocalStorage();

        const sortedData = posts.reduce((acc:Record<string, LikedPost[]>, current) => {
            if (acc[current.type]) {
                acc[current.type].push(current);
            } else {
                acc[current.type] = [current];
            }
            return acc;
        }, {});

        return sortedData;
    }

    getLocalStorage():LikedPost[] {
        const items = localStorage.getItem('liked-posts')
        if( items === null ) return []
        return JSON.parse(items);
    }

    renderPosts() {
        const updatedPosts = this.posts.map(post => {
            if (post._embedded?.['wp:featuredmedia']?.[0].media_details) {
                const featuredImageUrl = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium;
                return { ...post, image: featuredImageUrl };
            }
            return post;
        });
        
        this.renderInstance.renderComponents(updatedPosts);
    }
}

export default GetPosts;