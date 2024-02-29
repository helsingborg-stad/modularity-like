import { getLikedPostsFromLocalStorage } from "./helpers/likeHelpers";

class Like {
	likeIconSelector: string;

	constructor() {
		this.likeIconSelector = '.like-icon';
		this.handleLike();
		this.observe();
	}

	private handleLike() {
		const likeButtons = [...document.querySelectorAll('[data-like-icon]')];
		this.setLiked();
		likeButtons && this.setListeners(likeButtons);
	}

	private setListeners(likeButtons: Element[]) {
		likeButtons.forEach((button) => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const postId = button.getAttribute('data-post-id') ?? '';
				const postType = button.getAttribute('data-post-type') ?? '';
				this.setLocalStorage(postId, postType);
			});
			button.setAttribute('data-js-has-click', '');
		});
	}

	private setLocalStorage(postId: string, postType: string) {
		let likedPostIds = getLikedPostsFromLocalStorage();

		const index = likedPostIds.findIndex((item: { id: string, type: string }) => item.id === postId && item.type === postType);
		if (index === -1) {
			likedPostIds.push({ id: postId, type: postType });
		} else {
			likedPostIds.splice(index, 1);
		}

		localStorage.setItem('liked-posts', JSON.stringify(likedPostIds));
		this.toggleLiked(postId);
	}

	private toggleLiked(postId: string) {
		const icons = [...document.querySelectorAll(`[data-post-id="${postId}"]`)];
		icons &&
			icons.forEach((icon) => {
				icon.classList.toggle('is-liked');
				this.changeIcon(icon);
			});
	}

	private setLiked() {
		const likedPosts = getLikedPostsFromLocalStorage();
		likedPosts.forEach((post: { id: string }) => {
			const icons = [...document.querySelectorAll(`[data-post-id="${post.id}"]`)];
			icons &&
				icons.forEach((icon) => {
					icon.classList.add('is-liked');
					this.changeIcon(icon);
				});
		});
	}

	private changeIcon(icon: Element) {
		const span = icon.querySelector('span');

		if (span) {
			if (icon.classList.contains('is-liked')) {
				span.innerText = span.innerText.replace('_outline', '');
			} else {
				span.innerText = span.innerText + '_outline';
			}
		}
	}


	private observe() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'childList' &&
					mutation.addedNodes.length > 0
				) {
					let buttons: Element[] = [];
					[...mutation.addedNodes].forEach((node) => {
						if (
							node.nodeType === Node.ELEMENT_NODE &&
							(node as Element).querySelector(this.likeIconSelector)
						) {
							if (!((node as Element).querySelector(this.likeIconSelector)?.hasAttribute('data-js-has-click'))) {
								let button = (node as Element).querySelector(this.likeIconSelector);
								button && buttons.push(button);
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
