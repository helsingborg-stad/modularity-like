export interface LikedPosts {
    [key: string]: string;
}

export interface LikedPostMeta {
	postType: string;
	blogId: string;
	postId: string;
	likedAt: number;
	website: string;
}

export interface LikedPostsMeta {
	[id: string]: LikedPostMeta;
}

export interface WpApiSettings {
	root: string;
	nonce: string;
	versionString: string;
}

export interface StructuredLikedPosts {
	[website: string]: LikedPostMeta[];
}