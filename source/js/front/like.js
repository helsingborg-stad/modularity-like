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
                console.log("click");
                const postId = button.getAttribute('data-post-id');
                this.setLocalStorage(postId);
            });
        });
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
    }

    setLocalStorage(postId) {
        let likedPostIds = this.getLocalStorage();

        if (!likedPostIds.includes(postId)) {
            likedPostIds.push(postId);
        } else {
            likedPostIds.splice(likedPostIds.indexOf(postId), 1);
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

    setLiked(likedPostIds) {
        likedPostIds.forEach(postId => {
            const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
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