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
		likeButtons.forEach((button) => {
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

		const index = likedPostIds.findIndex((item) => item.id === postId && item.type === postType);
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
		icons &&
			icons.forEach((icon) => {
				icon.classList.toggle('is-liked');
				this.changeIcon(icon);
			});
	}

	setLiked(likedPosts) {
		likedPosts.forEach((post) => {
			const icons = document.querySelectorAll(`[data-post-id="${post.id}"]`);
			icons &&
				icons.forEach((icon) => {
					icon.classList.add('is-liked');
					this.changeIcon(icon);
				});
		});
	}

	changeIcon(icon) {
		if (icon.classList.contains('is-liked')) {
			icon.querySelector('span').innerHTML = icon.querySelector('span').innerHTML.replace('_outline', '');
		} else {
			icon.querySelector('span').innerHTML = icon.querySelector('span').innerHTML + '_outline';
		}
	}

	amountOfLikedPosts(likedPostIds) {
		const likedPostIdsAmount = document.querySelector('#liked-posts-amount');

		if (!likedPostIdsAmount || !likedPostIds) {
			return;
		}

		likedPostIdsAmount.innerHTML = likedPostIds.length;
	}

	generateEncodedLikedPostsParam() {
		// Retrieve the favorited posts from localStorage
		const likedPosts = JSON.parse(localStorage.getItem('liked-posts')) || [];

		if (likedPosts.length == 0) {
			return false;
		}

		// Encrypt the likedPosts data using Base64 encoding
		const encodedLikedPosts = btoa(JSON.stringify(likedPosts));

		// Return the encrypted likedPosts data as the query parameter liked-posts
		return '?liked-posts=' + encodedLikedPosts;
	}

	decodeLikedPosts(encodedLikedPosts) {
		if (!encodedLikedPosts) {
			return false;
		}
		// Decode the encoded liked posts data from Base64
		var decodedLikedPosts = atob(encodedLikedPosts);
		console.log('encodedLikedPosts', encodedLikedPosts);

		// Parse the decoded liked posts data into a JavaScript object
		var likedPosts = JSON.parse(decodedLikedPosts);

		// Return the JavaScript object of liked posts
		return likedPosts;
	}
}

export default Like;
