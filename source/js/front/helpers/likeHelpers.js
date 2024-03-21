export function getLikedPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('liked-posts')) || [];
}

export function getLikedPostLength(){
    return getLikedPostsFromLocalStorage().length;
}

export function generateEncodedLikedPostsParam() {
    const likedPosts = getLikedPostsFromLocalStorage();
    if (likedPosts.length == 0) {
        return false;
    }

    const compactLikedPosts = likedPosts.reduce((acc, post) => {
        if (!acc[post.type]) {
            acc[post.type] = [];
        }
        acc[post.type].push(post.id);
        return acc;
    }, {});

    const encodedLikedPosts = btoa(JSON.stringify(compactLikedPosts));

    return '?liked-posts=' + encodedLikedPosts;
}

export function decodeLikedPosts(encodedLikedPosts) {
    if (!encodedLikedPosts) {
        return false;
    }

    // Decode the encoded liked posts data from Base64
    var decodedLikedPosts = atob(encodedLikedPosts);

    // Parse the decoded liked posts data into a JavaScript object
    var compactLikedPosts = JSON.parse(decodedLikedPosts);

    // Convert back to original format
    var likedPosts = Object.entries(compactLikedPosts).reduce((acc, [type, ids]) => {
        ids.forEach((id) => {
            acc.push({ id, type });
        });
        return acc;
    }, []);

    // Return the JavaScript object of liked posts
    return likedPosts;
}