import StorageInterface from "./storage/storageInterface";

class Like {
	likeIconSelector: string;

	constructor(private likeStorage: StorageInterface) {
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
				e.stopPropagation();
				const postId = button.getAttribute('data-post-id') ?? '';
				const postType = button.getAttribute('data-post-type') ?? '';
				this.likeStorage.set(postId, postType);
				this.toggleLiked(postId);
				window.dispatchEvent(this.likedPostsUpdatedEvent());
			});
			button.setAttribute('data-js-has-click', '');
		});
	}

	private toggleLiked(postId: string) {
		const icons = [...document.querySelectorAll(`[data-post-id="${postId}"]`)];
		
		icons.forEach((icon) => {
			icon.classList.toggle('material-symbols--filled');
		});
	}

	private setLiked() {
		const likedPosts = this.likeStorage.get();

		Object.keys(likedPosts).forEach((postId) => {
			const icons = [...document.querySelectorAll(`[data-post-id="${postId}"]`)];
		
			icons.forEach((icon) => {
				icon.classList.add('material-symbols--filled');
			});
		});
		
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
							(node as Element).querySelectorAll(`${this.likeIconSelector}:not([data-js-has-click])`).forEach((button) => {
								buttons.push(button);
							});
							
							this.setLiked();
						}
					});
					this.setListeners(buttons);
				}
			});
		});
		observer.observe(document.body, { childList: true, subtree: true, attributes: false });
	}

	likedPostsUpdatedEvent() { 
		return new CustomEvent('likedPostsLengthUpdated', {});
    }
}

export default Like;
