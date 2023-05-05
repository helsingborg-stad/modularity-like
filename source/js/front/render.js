class Render {
	constructor(likedPostsComponents, LikeInstance) {
		this.components = likedPostsComponents;
		this.likeInstance = LikeInstance;
	}
	getLikedPosts() {
		const urlParams = new URLSearchParams(window.location.search);
		const encodedLikedPosts = urlParams.get('liked-posts');

		if (encodedLikedPosts) {
			const decodedLikedPosts = JSON.parse(atob(encodedLikedPosts));
			return decodedLikedPosts;
		} else {
			const likedPosts = JSON.parse(localStorage.getItem('liked-posts')) || [];
			return likedPosts;
		}
	}

	renderComponents(posts) {
		const containers = document.querySelectorAll('[js-like-container]');
		if (posts && posts.length > 0 && containers) {
			containers.forEach((container) => {
				const component = container.getAttribute('js-display-as');
				const filteredPosts = this.filterPosts(posts, JSON.parse(container.getAttribute('js-post-types')));
				const postColumns = container.hasAttribute('js-columns') ? container.getAttribute('js-columns') : 'grid-md-12';
				const emblemUrl = container.hasAttribute('js-like-emblem-url') ? container.getAttribute('js-like-emblem-url') : false;
				let hasPreloaders = true;
				let likeButtons = [];
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
						likeButtons.push(childElement.querySelector('[data-like-icon]'));
						childElement.replaceWith(...childElement.childNodes);
					});
				
				this.likeInstance.setLiked();
				this.likeInstance.setListeners(likeButtons);
			});
		} else {
			this.handlePreloaders(containers);
			/* TODO: Maybe display a notice here saying there are no liked posts */
		}

		const urlParams = new URLSearchParams(window.location.search);
		const encodedLikedPosts = urlParams.get('liked-posts');
		if (!encodedLikedPosts) {
			this.renderShareLink();
		}
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

	filterPosts(posts, postTypes) {
		const filteredPosts = posts.filter((post) => postTypes.includes(post.type));
		return filteredPosts;
	}
	renderShareLink() {
		const url = window.location.href.split('?')[0];
		const encodedLikedPostsParam = this.likeInstance.generateEncodedLikedPostsParam();

		// Skip if there are no liked posts
		if (!encodedLikedPostsParam) return;

		const shareLink = `${url}${encodedLikedPostsParam}`;
		const inputElement = document.createElement('input');
		inputElement.type = 'text';
		inputElement.value = shareLink;
		inputElement.classList.add('u-width--100');
		inputElement.addEventListener('click', (event) => {
			event.target.select();
		});

		const shareLinkElement = document.createElement('div');
		shareLinkElement.innerHTML = '<label class="u-padding__bottom--05">' + likedPostsLang.shareYourFavourites + ':</label>';
		shareLinkElement.appendChild(inputElement);
		shareLinkElement.classList.add('share-link', 'u-border', 'u-margin__bottom--2', 'u-padding--2');

		const firstContainer = document.querySelector('[js-like-container]');
		if (firstContainer) {
			firstContainer.before(shareLinkElement);
		} else {
			document.body.appendChild(shareLinkElement);
		}
	}
}
export default Render;
