class Render {
    constructor(likedPostsComponents, LikeInstance) {
        this.components = likedPostsComponents;
        this.likeInstance = LikeInstance;
    }

    renderComponents(posts) {
        const containers = document.querySelectorAll('[js-like-container]');
        if(posts && posts.length > 0 && containers) {
            containers.forEach(container => {
                const component = container.getAttribute('js-display-as');
                const filteredPosts = this.filterPosts(posts, JSON.parse(container.getAttribute('js-post-types')));
                const postColumns = container.hasAttribute('js-columns') ? container.getAttribute('js-columns') : 'grid-md-12';
                const emblemUrl = container.hasAttribute('js-like-emblem-url') ? container.getAttribute('js-like-emblem-url') : false;
                let hasPreloaders = true;
                let likeButtons = [];
                filteredPosts && filteredPosts.forEach(post => {
                    const childElement = document.createElement('div');
                    const html = this.components[`${component}`].html.replace('{LIKE_POST_TITLE}', post.title?.rendered).replace('{LIKE_POST_CONTENT}', this.handleExcerpt(post, component)).replace('{LIKE_POST_ID}', post.id).replace('{LIKE_POST_LINK}', post.link).replace('{LIKE_POST_IMAGE}', this.handleImage(post, emblemUrl)).replace('{LIKE_POST_TYPE}', post.type).replace('{LIKE_POST_CLASSES}', postColumns); 
                    childElement.innerHTML = html;
                    container.appendChild(childElement);
                    if (hasPreloaders) {
                        container.querySelectorAll('.liked-posts__preloader').forEach(preloader => {
                            preloader.remove();
                            hasPreloaders = false;
                        });
                    }
                    likeButtons.push(childElement.querySelector('[data-like-icon]'));
                    childElement.replaceWith(...childElement.childNodes);
                });
                this.likeInstance.setListeners(likeButtons);
            })
        } else {
            this.handlePreloaders(containers);
            /* TODO: Maybe display a notice here saying there are no liked posts */
        }
    }

    handleImage(post = false, emblemUrl) {
        if (!post) return "";
        
        let image = post.image ? post.image.source_url : (emblemUrl && emblemUrl.length > 0 ? emblemUrl : '');

        return image;
    }

    handleExcerpt(post = false, component) {
        if (!post) return "";
        let amount;
        let excerpt = post.excerpt?.rendered ? post.excerpt.rendered : (post.content?.rendered ? post.content.rendered : '');
        excerpt = excerpt.replace(/<[^>]*>/g, '');

        switch (component) {
            case 'collection': 
                amount = 15;
                break;
            case 'card': 
                amount = 25;
                break;
            default: 
                amount = 25;
        }

        excerpt = excerpt.split(' ').splice(0, amount).join(' ');

        let symbol = '...';

        if (excerpt && excerpt.length) {
            if (excerpt.charAt(excerpt.length - 1) === '.') {
                symbol = '..';
            }
        }
        
        return excerpt ? excerpt + symbol : '';
    }

    handlePreloaders(containers) {
        containers.forEach(container => {
            container.querySelectorAll('.liked-posts__preloader').forEach(preloader => {
                preloader.remove();
            });
        });
    }

    filterPosts(posts, postTypes) {
        const filteredPosts = posts.filter(post => postTypes.includes(post.type));
        return filteredPosts;
    }
}
export default Render;