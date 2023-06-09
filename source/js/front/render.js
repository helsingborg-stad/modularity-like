class Render {
	constructor(posts, components) {
		this.components = components;
		this.posts = posts;

		if (!this.posts || !components) return;

		this.renderComponents();
	}

	renderComponents() {
		const containers = document.querySelectorAll('[js-like-container]');
		const urlParams = new URLSearchParams(window.location.search);

		if (this.posts && this.posts.length > 0 && containers) {
			containers.forEach((container) => {
				const component = container.getAttribute('js-display-as');
				const filteredPosts = this.filterPosts(JSON.parse(container.getAttribute('js-post-types')));
				const postColumns = container.hasAttribute('js-columns') ? container.getAttribute('js-columns') : 'grid-md-12';
				const emblemUrl = container.hasAttribute('js-like-emblem-url') ? container.getAttribute('js-like-emblem-url') : false;
				let hasPreloaders = true;
				this.handleSharedParams(container, urlParams);

				filteredPosts && 
					filteredPosts.forEach((post) => {
						const childElement = document.createElement('div');
						const html = this.components[`${component}`].html
							.replace('{LIKE_POST_TITLE}', post.title?.rendered)
							.replace('{LIKE_POST_CONTENT}', this.handleExcerpt(post, component))
							.replace('{LIKE_POST_ID}', post.id)
							.replace('{LIKE_POST_LINK}', post.link)
							.replace('{LIKE_POST_IMAGE}', this.handleImage(post, emblemUrl))
							.replace('{LIKE_POST_TYPE}', post.type)
							.replace('{LIKE_POST_CLASSES}', postColumns);
						childElement.innerHTML = html;
						container.appendChild(childElement);
						if (hasPreloaders) {
							container.querySelectorAll('.liked-posts__preloader').forEach((preloader) => {
								preloader.remove();
								hasPreloaders = false;
							});
						}
					});
			});
		} else {
			this.handlePreloaders(containers);
			/* TODO: Maybe display a notice here saying there are no liked posts */
		}
	}

	handleSharedParams(container, urlParams) {
		const parentContainer = container.closest('.like-posts__container');
		if (!parentContainer) return;
		const title = parentContainer.querySelector('[data-js-liked-posts-share-title]');
		const excerpt = parentContainer.querySelector('[data-js-liked-posts-share-excerpt]');

		let listName = urlParams.get('liked-name');
		let listExcerpt = urlParams.get('liked-excerpt');

		if (listName) {
			title.textContent = this.controlURLParameters(listName);
			title.classList.remove('u-display--none');
		}

		if (listExcerpt) {
			excerpt.textContent = this.controlURLParameters(listExcerpt);
			excerpt.classList.remove('u-display--none');
		}
	}

	controlURLParameters(encodedString) {
		let string = atob(encodedString);
		string = string.replace(/(<([^>]+)>)/gi, '');
		return string;
	}

	handleImage(post = false, emblemUrl) {
		if (!post) return '';

		let image = post.image ?? (emblemUrl && emblemUrl.length > 0 ? emblemUrl : '');

		return image;
	}

	handleExcerpt(post = false, component) {
		if (!post) return '';
		let amount;
		let excerpt = post.excerpt?.rendered ? post.excerpt.rendered : post.content?.rendered ? post.content.rendered : '';
		excerpt = excerpt.replace(/<[^>]*>/g, '');

		switch (component) {
			case 'collection':
				amount = 15;
				break;
			case 'card':
				amount = 25;
				break;
			default:
				amount = 25;
		}

		excerpt = excerpt.split(' ').splice(0, amount).join(' ');

		let symbol = '...';

		if (excerpt && excerpt.length) {
			if (excerpt.charAt(excerpt.length - 1) === '.') {
				symbol = '..';
			}
		}

		return excerpt ? excerpt + symbol : '';
	}

	handlePreloaders(containers) {
		containers.forEach((container) => {
			container.querySelectorAll('.liked-posts__preloader').forEach((preloader) => {
				preloader.remove();
			});
		});
	}

	filterPosts(postTypes) {
		const filteredPosts = this.posts.filter((post) => postTypes.includes(post.type));
		return filteredPosts;
	}
}
export default Render;
