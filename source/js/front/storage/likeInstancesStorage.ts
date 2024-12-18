import Like from '../like';

interface LikeInstancesStorageInterface {
    [postId: string]: Like[];
}

class LikeInstancesStorage {
    private instances: LikeInstancesStorageInterface = {};

    // Returns all instances of a like button with a given postId
    public getInstances(postId: string): Like[] {
        return this.instances[postId] || [];
    }

    // Adds a new instance of a like button with a given
    public addInstance(postId: string, likeInstance: Like): void {
        if (!this.instances[postId]) {
            this.instances[postId] = [];
        }

        this.instances[postId].push(likeInstance);
    }
}

export default LikeInstancesStorage;

