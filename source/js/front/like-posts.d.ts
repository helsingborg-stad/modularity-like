export interface LikedPosts {
    [key: string]: string;
}

export interface LikedPostMeta {
	[id: string]: {
		postType: string;
		blogId: string;
		postId: string;
		likedAt: number;
	}
}

export interface WpApiSettings {
	root: string;
	nonce: string;
	versionString: string;
}