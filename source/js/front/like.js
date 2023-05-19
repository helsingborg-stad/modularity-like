class Like {
	constructor() {
		this.handleLike();
		this.observe();
	}
	
	handleLike() {
		const likeButtons = document.querySelectorAll('[data-like-icon]');
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
			button.setAttribute('data-js-has-click', '');
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
	}

	toggleLiked(postId) {
		const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
		icons &&
			icons.forEach((icon) => {
				icon.classList.toggle('is-liked');
				this.changeIcon(icon);
			});
	}

	setLiked(likedPosts = this.getLocalStorage()) {
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
			icon.querySelector('span').innerText = icon.querySelector('span').innerText.replace('_outline', '');
		} else {
			icon.querySelector('span').innerText = icon.querySelector('span').innerText + '_outline';
		}
	}

	generateEncodedLikedPostsParam() {
		const likedPosts = this.getLocalStorage();
		if (likedPosts.length == 0) {
			return false;
		}

		const compactLikedPosts = likedPosts.reduce((acc, post) => {
			if (!acc[post.type]) {
				acc[post.type] = [];
			}
			acc[post.type].push(post.id);
			return acc;
		}, {});

		const encodedLikedPosts = btoa(JSON.stringify(compactLikedPosts));

		return '?liked-posts=' + encodedLikedPosts;
	}
	decodeLikedPosts(encodedLikedPosts) {
		if (!encodedLikedPosts) {
			return false;
		}

		// Decode the encoded liked posts data from Base64
		var decodedLikedPosts = atob(encodedLikedPosts);

		// Parse the decoded liked posts data into a JavaScript object
		var compactLikedPosts = JSON.parse(decodedLikedPosts);

		// Convert back to original format
		var likedPosts = Object.entries(compactLikedPosts).reduce((acc, [type, ids]) => {
			ids.forEach((id) => {
				acc.push({ id, type });
			});
			return acc;
		}, []);

		// Return the JavaScript object of liked posts
		return likedPosts;
	}

	observe() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'childList' &&
					mutation.addedNodes.length > 0
				) {
					let buttons = [];
					[...mutation.addedNodes].forEach((node) => {
						if (
							node.nodeType === Node.ELEMENT_NODE &&
							node.querySelector('.like-icon') &&
							!node.querySelector('.like-icon').hasAttribute('data-js-has-click')
						) {
							let button = node.querySelector('.like-icon'); 
							buttons.push(button);
						}
					});
					this.setListeners(buttons);
				}
			});
		});
		observer.observe(document.body, { childList: true, subtree: true, attributes: false });
	}
}

export default Like;
