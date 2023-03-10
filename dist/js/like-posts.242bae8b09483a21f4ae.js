/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./source/js/front/getPosts.js":
/*!*************************************!*\
  !*** ./source/js/front/getPosts.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class GetPosts {
    constructor(RenderInstance) {
        this.getPosts();
        this.posts = null;
        this.renderInstance = RenderInstance;
    }

    getPosts() {
        if (!document.querySelector('[js-like-container]')) {
            return;
        }

        if (this.posts) {
            return this.renderPosts();
        }

        let items = this.handleEndpoints() ?? "";
        const wantedPostTypes = this.getContainersPostTypes();

        let urls = [];
        if (items) {
            for (const key in items) {
                if (items.hasOwnProperty(key) && wantedPostTypes.includes(key)) {
                    urls.push(this.getUrls(key, items[key]));
                }
            }
        }
        if (urls.length > 0) {
            this.fetchPosts(urls);
        }


    }

    fetchPosts(urls) {
        const requests = urls.map(url => fetch(url));
        Promise.all(requests)
            .then(responses => {
                const jsonPromises = responses.map(response => response.json());
                return Promise.all(jsonPromises);
            })
            .then(data => {
                const postsArray = [].concat(...data);
                this.posts = postsArray;
                this.renderPosts();
            })
            .catch(error => {
                console.log(error);
            })
    }

    getUrls(key, ids) {
        let idString = '';
            ids.forEach((id, index) => {
                idString += id.id;
                if (index < ids.length - 1) {
                    idString += ',';
                }
            });
        const endpoint = `https://localhost/wptest/wp-json/wp/v2/${key === 'post' ? 'posts' : key}?_embed&include=${idString}`;
        return endpoint;
    }

    getContainersPostTypes() {
        const containers = document.querySelectorAll('[js-like-container]');
        let arr = [];
        containers.forEach((container) => {
            if (!container.hasAttribute('js-post-types')) {
                return;
            }
            const postTypes = JSON.parse(container.getAttribute('js-post-types'));
            postTypes.forEach((postType) => {
                if (!arr.includes(postType)) {
                    arr.push(postType);
                }
            });
        });
        
        return arr;
    }

    /**
     * sorts the array of liked posts in local storage based on their type (object parameter)
     * @returns An object with the keys of the different types of posts and the values being an array
     * of the posts of that type.
     */
    handleEndpoints() {
        let posts = this.getLocalStorage();

        const sortedData = posts.reduce((acc, current) => {
            if (acc[current.type]) {
                acc[current.type].push(current);
            } else {
                acc[current.type] = [current];
            }
            return acc;
        }, {});

        return sortedData;
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
    }

    renderPosts() {
        const updatedPosts = this.posts.map(post => {
            if (post._embedded?.['wp:featuredmedia']?.[0].media_details) {
                const featuredImageUrl = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium;
                return { ...post, image: featuredImageUrl };
            }
            return post;
        });
        
        this.renderInstance.renderComponents(updatedPosts);
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GetPosts);

/***/ }),

/***/ "./source/js/front/like.js":
/*!*********************************!*\
  !*** ./source/js/front/like.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

        const index = likedPostIds.findIndex(item => item.id === postId && item.type === postType);
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
        icons && icons.forEach(icon => {
            icon.classList.toggle('is-liked');
            this.changeIcon(icon);
        })
    }

    setLiked(likedPosts) {
        likedPosts.forEach(post => {
            const icons = document.querySelectorAll(`[data-post-id="${post.id}"]`);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Like);

/***/ }),

/***/ "./source/js/front/render.js":
/*!***********************************!*\
  !*** ./source/js/front/render.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Render {
    constructor(likedPostsComponents, LikeInstance) {
        this.components = likedPostsComponents;
        this.likeInstance = LikeInstance;
    }

    renderComponents(posts) {
        const containers = document.querySelectorAll('[js-like-container]');
        if(posts && posts.length > 0 && containers) {
            containers.forEach(container => {
                const component = container.getAttribute('js-display-as');
                const filteredPosts = this.filterPosts(posts, JSON.parse(container.getAttribute('js-post-types')));
                let likeButtons = [];
                filteredPosts && filteredPosts.forEach(post => {
                    const childElement = document.createElement('div');
                    const html = this.components[`${component}`].html.replace('{LIKE_POST_TITLE}', post.title.rendered).replace('{LIKE_POST_CONTENT}', post.excerpt.rendered).replace('{LIKE_POST_ID}', post.id).replace('{LIKE_POST_LINK}', post.link).replace('{LIKE_POST_IMAGE}', post.image ? post.image.source_url : '').replace('{LIKE_POST_TYPE}', post.type); 
                    childElement.innerHTML = html;
                    container.appendChild(childElement);
                    likeButtons.push(childElement.querySelector('[data-like-icon]'));
                    childElement.classList.add('u-position--relative');
                });
                this.likeInstance.setListeners(likeButtons);
            })
        }
    }

    filterPosts(posts, postTypes) {
        const filteredPosts = posts.filter(post => postTypes.includes(post.type));
        return filteredPosts;
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./source/js/like-posts.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _front_getPosts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./front/getPosts */ "./source/js/front/getPosts.js");
/* harmony import */ var _front_like__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./front/like */ "./source/js/front/like.js");
/* harmony import */ var _front_render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./front/render */ "./source/js/front/render.js");




const LikeInstance = new _front_like__WEBPACK_IMPORTED_MODULE_1__["default"]();
const RenderInstance = new _front_render__WEBPACK_IMPORTED_MODULE_2__["default"](likedPostsComponents, LikeInstance);
const GetPostsInstance = new _front_getPosts__WEBPACK_IMPORTED_MODULE_0__["default"](RenderInstance);
})();

/******/ })()
;
//# sourceMappingURL=like-posts.242bae8b09483a21f4ae.js.map