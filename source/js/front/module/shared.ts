class Shared {
    private displayNoneClass: string = 'u-display--none';
    private nameParamKey: string = 'liked-name';
    private excerptParamKey: string = 'liked-excerpt';

    constructor(
        private renderContainer: HTMLElement,
        private urlParams: URLSearchParams,
        private title: HTMLElement,
        private excerpt: HTMLElement
    ) {
        this.addSharedData();
    }

    /**
     * Adds shared data (name and excerpt) to the DOM from URL parameters.
     */
    private addSharedData() {
        let listName = this.urlParams.get(this.nameParamKey);
        let listExcerpt = this.urlParams.get(this.excerptParamKey);
        if (this.title && listName) {
            this.setSharedValue(this.title, listName);
        }

        if (this.excerpt && listExcerpt) {
            this.setSharedValue(this.excerpt, listExcerpt);
        }
    }

    /**
     * Sets the shared value for an element and makes it visible.
     * @param element - The element to update.
     * @param value - The value to set (encoded).
     */
    private setSharedValue(element: HTMLElement, value: string) {
        element.textContent = this.sanitizeUrlParams(value);
        element.classList.remove(this.displayNoneClass);
    }

    /**
     * Decodes and sanitizes a base64-encoded string from URL parameters.
     * @param encodedString - The encoded string to decode and sanitize.
     * @returns The sanitized string.
     */
    private sanitizeUrlParams(encodedString: string) {
		let string = atob(encodedString);
		string = string.replace(/(<([^>]+)>)/gi, '');
		return string;
	}
}

export default Shared;