class GetPosts {
    constructor(RenderInstance) {
        this.getPosts();
        this.posts = null;
        this.renderInstance = RenderInstance;
    }

    getPosts() {
        if (!document.querySelector('[js-like-container]')) {
            return;
        }
        if (this.posts) {
            return this.handlePosts();
        }

        let items = this.handleEndpoints() ?? "";

        let urls = [];
        if (items) {
            for (const key in items) {
                if (items.hasOwnProperty(key)) {
                    urls.push(this.getUrls(key, items[key]));
                }
            }
        }
        if (urls.length > 0) {
            this.fetchPosts(urls);
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
                this.handlePosts();
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
        const endpoint = `https://localhost/wptest/wp-json/wp/v2/${key === 'post' ? 'posts' : key}?_embed&include=${idString}`;
        return endpoint;

        
    }

    handleEndpoints() {
        let posts = this.getLocalStorage();

        const sortedData = posts.reduce((acc, cur) => {
            if (acc[cur.type]) {
                acc[cur.type].push(cur);
            } else {
                acc[cur.type] = [cur];
            }
            return acc;
        }, {});

        return sortedData;
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
    }

    handlePosts() {
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