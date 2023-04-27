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
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (19:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n| \t}\n| \n> <<<<<<< HEAD\n| \trenderComponents(posts) {\n| \t\tconst containers = document.querySelectorAll('[js-like-container]');");

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
//# sourceMappingURL=like-posts.cf3e7830bffc51dc1c83.js.map