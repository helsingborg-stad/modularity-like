class Render {
	constructor(likedPostsComponents, LikeInstance) {
		this.components = likedPostsComponents;
		this.likeInstance = LikeInstance;
	}
	// getLikedPosts() {
	// 	const urlParams = new URLSearchParams(window.location.search);
	// 	const encodedLikedPosts = urlParams.get('liked-posts');
	// 	if (encodedLikedPosts) {
	// 		const decodedLikedPosts = JSON.parse(atob(encodedLikedPosts));
	// 		return decodedLikedPosts;
	// 	} else {
	// 		const likedPosts = JSON.parse(localStorage.getItem('liked-posts')) || [];
	// 		return likedPosts;
	// 	}
	// }

	renderComponents(posts) {
		const containers = document.querySelectorAll('[js-like-container]');
		const urlParams = new URLSearchParams(window.location.search);

		if (posts && posts.length > 0 && containers) {
			containers.forEach((container) => {
				const parentContainer = container.closest('.like-posts__container');
				const component = container.getAttribute('js-display-as');
				const filteredPosts = this.filterPosts(posts, JSON.parse(container.getAttribute('js-post-types')));
				const postColumns = container.hasAttribute('js-columns') ? container.getAttribute('js-columns') : 'grid-md-12';
				const emblemUrl = container.hasAttribute('js-like-emblem-url') ? container.getAttribute('js-like-emblem-url') : false;
				let hasPreloaders = true;
				let likeButtons = [];
				this.handleSharedParams(parentContainer);

				filteredPosts && 
					filteredPosts.forEach((post) => {
						console.log(post);
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
			});
		} else {
			this.handlePreloaders(containers);
			/* TODO: Maybe display a notice here saying there are no liked posts */
		}

		const encodedLikedPosts = urlParams.get('liked-posts');
		if (!encodedLikedPosts) {
			this.renderShareLink();
		}
	}

	handleSharedParams(parentContainer) {
		console.log(parentContainer);
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
		const containers = document.querySelectorAll('.like-posts__container');

		// Skip if there are no liked posts
		if (!encodedLikedPostsParam) return;

		const shareLink = `${url}${encodedLikedPostsParam}`;

		containers.forEach(container => {
			const button = container.querySelector('button');
			const dialog = container.querySelector('dialog');
			const urlField = dialog.querySelector('[data-js-like-share-url]');
			const nameField = dialog.querySelector('[data-js-like-share-name]');
			const excerptField = dialog.querySelector('[data-js-like-share-excerpt]');

			// Update the input fields with the new shareLink value
			urlField.value = shareLink;

			// Add event listeners to the nameField and excerptField
			nameField.addEventListener('input', this.updateShareLink.bind(this, urlField, nameField, excerptField));
			excerptField.addEventListener('input', this.updateShareLink.bind(this, urlField, nameField, excerptField));

			// Remove the 'u-display--none' class from the button
			button.classList.remove('u-display--none');
		});
	}

	updateShareLink(urlField, nameField, excerptField) {
		const newName = btoa(nameField.value);
		const newExcerpt = btoa(excerptField.value);
		const url = new URL(urlField.value);

		if (url) {
			url.searchParams.set('liked-name', newName);
			url.searchParams.set('liked-excerpt', newExcerpt);

			if (!newName) {
				url.searchParams.delete('liked-name');
			}

			if (!newExcerpt) {
				url.searchParams.delete('liked-excerpt');
			}
		}

		urlField.value = url;
	}

}
export default Render;
