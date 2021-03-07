
const PriorityQueue = {

    tree: [],

    push: function(val) {
        this.tree.push(val)
    },

    pop: function() {
        let maxIndex = 0
        for (let i = 1, len = this.tree.length; i < len; i++) {
            if (this.tree[i] > this.tree[maxIndex]) {
                maxIndex = i
            }
        }

        return this.tree.splice(maxIndex, 1)
    },

    isEmpty: function() {
        return this.tree.length === 0
    }
}
