class Like {
    constructor() {
        this.handleLike();
    }

    handleLike() {
        const likeButtons = document.querySelectorAll('[data-like-icon]');

        this.amountOfLikedPosts(this.getLocalStorage());
        this.setLiked(this.getLocalStorage());
        likeButtons && this.setListeners(likeButtons);
    }

    setListeners(likeButtons) {
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = button.getAttribute('data-post-id');
                const postType = button.getAttribute('data-post-type');
                this.setLocalStorage(postId, postType);
            });
        });
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
    }

    setLocalStorage(postId, postType) {
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

    toggleLiked(postId) {
        const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
        icons && icons.forEach(icon => {
            icon.classList.toggle('is-liked');
            this.changeIcon(icon);
        })
    }

    setLiked(likedPosts) {
        likedPosts.forEach(post => {
            const icons = document.querySelectorAll(`[data-post-id="${post.id}"]`);
            icons && icons.forEach(icon => {
                icon.classList.add('is-liked');
                this.changeIcon(icon);
            });
        });
    }

    changeIcon(icon) {
        if(icon.classList.contains('is-liked')) {
            icon.querySelector('span').innerHTML = icon.querySelector('span').innerHTML.replace("_outline", '');
        } else {
            icon.querySelector('span').innerHTML = icon.querySelector('span').innerHTML + "_outline";
        }
    }

    amountOfLikedPosts(likedPostIds) {
        const likedPostIdsAmount = document.querySelector('#liked-posts-amount');

        if (!likedPostIdsAmount || !likedPostIds) {
            return;
        }

        likedPostIdsAmount.innerHTML = likedPostIds.length;
    }
}

export default Like;