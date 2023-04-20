class GetPosts {
    constructor(RenderInstance) {
        this.renderInstance = RenderInstance;
        this.getPosts();
        this.posts = null;
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
        } else {
            this.renderInstance.renderComponents(false);
        }
    }

    fetchPosts(urls) {
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

    getUrls(key, ids) {
        let idString = '';
            ids.forEach((id, index) => {
                idString += id.id;
                if (index < ids.length - 1) {
                    idString += ',';
                }
            });
        const endpoint = `${pageUrl}/wp-json/wp/v2/${key === 'post' ? 'posts' : key}?_embed&include=${idString}`;

        return endpoint;
    }

    getContainersPostTypes() {
        const containers = document.querySelectorAll('[js-like-container]');
        let arr = [];
        containers.forEach((container) => {
            if (!container.hasAttribute('js-post-types')) {
                return;
            }
            const postTypes = JSON.parse(container.getAttribute('js-post-types'));
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
    handleEndpoints() {
        let posts = this.getLocalStorage();

        const sortedData = posts.reduce((acc, current) => {
            if (acc[current.type]) {
                acc[current.type].push(current);
            } else {
                acc[current.type] = [current];
            }
            return acc;
        }, {});

        return sortedData;
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
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