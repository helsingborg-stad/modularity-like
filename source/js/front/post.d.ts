export interface Post {
    id: number;
    title?: { rendered: string };
    excerpt?: { rendered: string };
    content?: { rendered: string };
    link: string;
    type: string;
    image?: string;
    _embedded?: {
        'wp:featuredmedia'?: { media_details?: { sizes?: { medium?: { source_url?: string } } } }[];
    };
}
