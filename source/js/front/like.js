import { getLocalStorage } from "./helpers/likeHelpers";

class Like {
	constructor() {
		this.handleLike();
		this.observe();
	}
	
	handleLike() {
		const likeButtons = document.querySelectorAll('[data-like-icon]');
		this.setLiked();
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

	setLocalStorage(postId, postType) {
		let likedPostIds = getLocalStorage();

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

	setLiked() {
		const likedPosts = getLocalStorage();
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
							node.querySelector('.like-icon')
						) {
							if (!node.querySelector('.like-icon').hasAttribute('data-js-has-click')) {
								let button = node.querySelector('.like-icon'); 
								buttons.push(button);
							} 
							this.setLiked();
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
