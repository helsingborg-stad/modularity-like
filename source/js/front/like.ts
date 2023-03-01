class Like {
    constructor() {
        this.handleLike();
    }

    handleLike() {
        const likeButtons = document.querySelectorAll('[data-like-icon]');

        this.amountOfLikedPosts(this.getLocalStorage());
        this.setLiked(this.getLocalStorage());
        likeButtons && this.setListeners(Array.from(likeButtons));
    }

    setListeners(likeButtons:Element[]) {
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = button.getAttribute('data-post-id');
                const postType = button.getAttribute('data-post-type');

                if( postId === null ) return
                if( postType === null ) return

                this.setLocalStorage(postId, postType);
            });
        });
    }

    

    getLocalStorage() :LikedPost[] {
        const item = localStorage.getItem('liked-posts');
        if( item === null ) return []
        return JSON.parse(item);
    }

    setLocalStorage(postId:LikedPost['id'], postType:LikedPost['type']) {
        let likedPostIds = this.getLocalStorage();

        const index = likedPostIds.findIndex(item => item.id === postId && item.type === postType);
        if (index === -1) {
            likedPostIds.push({ id: postId, type: postType });
        } else {
            likedPostIds.splice(index, 1);
        }
        
        localStorage.setItem('liked-posts', JSON.stringify(likedPostIds));
        this.toggleLiked(postId);
        this.amountOfLikedPosts(likedPostIds);
    }

    toggleLiked(postId:LikedPost['id']) {
        const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
        icons && icons.forEach(icon => {
            icon.classList.toggle('is-liked');
            this.changeIcon(icon);
        })
    }

    setLiked(likedPosts:LikedPost[]) {
        likedPosts.forEach(post => {
            const icons = document.querySelectorAll(`[data-post-id="${post.id}"]`);
            icons && icons.forEach(icon => {
                icon.classList.add('is-liked');
                this.changeIcon(icon);
            });
        });
    }

    changeIcon(icon:Element) {
        const iconInnerElement = icon.querySelector('span')
        if( iconInnerElement === null ) return
        
        if(icon.classList.contains('is-liked')) {
            iconInnerElement.innerHTML = iconInnerElement.innerHTML.replace("_outline", '');
        } else {
            iconInnerElement.innerHTML = iconInnerElement.innerHTML + "_outline";
        }
    }

    amountOfLikedPosts(likedPostIds:LikedPost[]) {
        const likedPostIdsAmount = document.querySelector('#liked-posts-amount');

        if (!likedPostIdsAmount || !likedPostIds) {
            return;
        }

        likedPostIdsAmount.innerHTML = likedPostIds.length.toString();
    }
}

export default Like;