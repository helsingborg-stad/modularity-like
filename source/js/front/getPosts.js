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
        const endpoint = "https://localhost/wptest/wp-json/wp/v2/posts?_embed";
        fetch(endpoint)
            .then(response => response.json())
            .then(posts => {
                this.posts = posts;
                this.handlePosts()
            })
            .catch(error => {
                console.log(error);
            });
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
    }

    handlePosts() {
        const filteredPosts = this.posts.filter(post => this.getLocalStorage().includes(post.id.toString())) || [];

        filteredPosts.forEach(post => {
            if (post._embedded['wp:featuredmedia']) {
                let featuredImageId = post._embedded['wp:featuredmedia'][0].id;
                let featuredImageUrl = post._embedded['wp:featuredmedia'][0];
            }
        });
        this.renderInstance.renderComponents(filteredPosts);
    }
}

export default GetPosts;