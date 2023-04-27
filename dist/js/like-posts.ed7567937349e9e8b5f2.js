/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./source/js/front/getPosts.js":
/*!*************************************!*\
  !*** ./source/js/front/getPosts.js ***!
  \*************************************/
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (114:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n| \t}\n| \n> <<<<<<< HEAD\n| \tgetLocalStorage() {\n| \t\treturn JSON.parse(localStorage.getItem('liked-posts')) || [];");

/***/ }),

/***/ "./source/js/front/like.js":
/*!*********************************!*\
  !*** ./source/js/front/like.js ***!
  \*********************************/
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (53:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n| \t}\n| \n> <<<<<<< HEAD\n| \tsetLiked(likedPosts) {\n| \t\tlikedPosts.forEach((post) => {");

/***/ }),

/***/ "./source/js/front/render.js":
/*!***********************************!*\
  !*** ./source/js/front/render.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

		let image = post.image ? post.image.source_url : emblemUrl && emblemUrl.length > 0 ? emblemUrl : '';

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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Render);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************!*\
  !*** ./source/js/like-posts.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _front_getPosts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./front/getPosts */ "./source/js/front/getPosts.js");
/* harmony import */ var _front_like__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./front/like */ "./source/js/front/like.js");
/* harmony import */ var _front_render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./front/render */ "./source/js/front/render.js");




const LikeInstance = new _front_like__WEBPACK_IMPORTED_MODULE_1__["default"]();
const RenderInstance = new _front_render__WEBPACK_IMPORTED_MODULE_2__["default"](likedPostsComponents, LikeInstance);
const GetPostsInstance = new _front_getPosts__WEBPACK_IMPORTED_MODULE_0__["default"](RenderInstance, LikeInstance);

})();

/******/ })()
;
//# sourceMappingURL=like-posts.ed7567937349e9e8b5f2.js.map