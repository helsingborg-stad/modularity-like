import Like from './like';

class Render {

    private components;
    private likeInstance:Like;

    constructor(likedPostsComponents:any, LikeInstance:Like) {
        this.components = likedPostsComponents;
        this.likeInstance = LikeInstance;
    }

    renderComponents(posts:Post[]) {
        const containers = document.querySelectorAll('[js-like-container]');
        if(posts && posts.length > 0 && containers) {
            containers.forEach(container => {
                const component = container.getAttribute('js-display-as');
                const jsPostTypes = container.getAttribute('js-post-types')
                if(jsPostTypes === null) {
                    return;
                }
                const filteredPosts = this.filterPosts(posts, JSON.parse(jsPostTypes));
                let likeButtons:Element[] = [];
                filteredPosts && filteredPosts.forEach(post => {
                    const childElement = document.createElement('div');
                    const html = this.components[`${component}`].html.replace('{LIKE_POST_TITLE}', post.title.rendered).replace('{LIKE_POST_CONTENT}', post.excerpt.rendered).replace('{LIKE_POST_ID}', post.id).replace('{LIKE_POST_LINK}', post.link).replace('{LIKE_POST_IMAGE}', post.image ? post.image.source_url : '').replace('{LIKE_POST_TYPE}', post.type); 
                    childElement.innerHTML = html;
                    container.appendChild(childElement);
                    const likeIconElement = childElement.querySelector('[data-like-icon]')
                    
                    if( likeIconElement === null ) {
                        console.error('Could not find element with data attribute "data-like-icon"')
                        return
                    }
            
                    likeButtons.push(likeIconElement);
                    childElement.classList.add('u-position--relative');
                });
                this.likeInstance.setListeners(likeButtons);
            })
        }
    }

    filterPosts(posts:Post[], postTypes:string[]):Post[] {
        const filteredPosts = posts.filter(post => postTypes.includes(post.type));
        return filteredPosts;
    }
}
export default Render;