class Shared {
    constructor(
        private renderContainer: HTMLElement,
        private urlParams: URLSearchParams,
        private title: HTMLElement,
        private excerpt: HTMLElement
    ) {
        this.addSharedData();
    }

    private addSharedData() {
        let listName = this.urlParams.get('liked-name');
        let listExcerpt = this.urlParams.get('liked-excerpt');
        if (this.title && listName) {
            this.setSharedValue(this.title, listName);
        }

        if (this.excerpt && listExcerpt) {
            this.setSharedValue(this.excerpt, listExcerpt);
        }

        if (this.excerpt && listExcerpt || this.title && listName) {
			this.renderContainer.classList.add('u-margin__top--3');
		}
    }

    private setSharedValue(element: HTMLElement, value: string) {
        element.textContent = this.sanitizeUrlParams(value);
        element.classList.remove('u-display--none');
    }

    private sanitizeUrlParams(encodedString: string) {
		let string = atob(encodedString);
		string = string.replace(/(<([^>]+)>)/gi, '');
		return string;
	}
}

export default Shared;