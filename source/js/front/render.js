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
                let likeButtons = [];
                posts.forEach(post => {
                    console.log(post);
                    const childElement = document.createElement('div');
                    const html = this.components[`${component}`].html.replace('{LIKE_POST_TITLE}', post.title.rendered).replace('{LIKE_POST_CONTENT}', post.excerpt.rendered).replace('{LIKE_POST_ID}', post.id).replace('{LIKE_POST_LINK}', post.link).replace('{LIKE_POST_IMAGE}', post.image ? post.image.source_url : ''); 
                    childElement.innerHTML = html;
                    container.appendChild(childElement);
                    likeButtons.push(childElement.querySelector('[data-like-icon]'));
                    childElement.classList.add('u-position--relative');
                });
                this.likeInstance.setListeners(likeButtons);
            })
        }
    }
}
export default Render;