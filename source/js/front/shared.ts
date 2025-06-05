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

    private setSharedValue(element: HTMLElement, value: string) {
        element.textContent = this.sanitizeUrlParams(value);
        console.log(this.sanitizeUrlParams(value));
        element.classList.remove(this.displayNoneClass);
    }

    private sanitizeUrlParams(encodedString: string) {
		let string = atob(encodedString);
		string = string.replace(/(<([^>]+)>)/gi, '');
		return string;
	}
}

export default Shared;