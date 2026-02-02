import Like from '../like/like';

interface LikeInstancesStorageInterface {
    [postId: string]: Like[];
}

class LikeInstancesStorage {
    private instances: LikeInstancesStorageInterface = {};

    /**
     * Returns all instances of a like button with a given postId.
     * @param postId - The post ID to retrieve instances for.
     * @returns Array of Like instances.
     */
    public getInstances(postId: string): Like[] {
        return this.instances[postId] || [];
    }

    /**
     * Adds a new instance of a like button with a given postId.
     * @param postId - The post ID to associate with the instance.
     * @param likeInstance - The Like instance to add.
     */
    public addInstance(postId: string, likeInstance: Like): void {
        if (!this.instances[postId]) {
            this.instances[postId] = [];
        }

        this.instances[postId].push(likeInstance);
    }
}

export default LikeInstancesStorage;

