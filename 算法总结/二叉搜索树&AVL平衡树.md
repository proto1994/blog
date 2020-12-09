```js
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(key) {
    if (this.root == null) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key);
    }
  }
  
  insertNode(node, key) {
    if (key < node.key) {
      if (node.left == null) {
        node.left = new Node(key);
      } else {
        this.insertNode(node.left, key)
      }
    } else if (key > node.key) {
      if (node.right == null) {
        node.right = new Node(key);
      } else {
        this.insertNode(node.right, key)
      }
    } 
  }
  
  search(key, node = this.root) {
    if (node == null) return false;
    if (key < node.key) {
      this.search(key, node.left)
    } else if (key > node.key) {
      this.search(key, node.right)
    } else {
      return true
    }
    return false;
  }
  
  remove(key, node = this.root) {
    if (node == null) return null;
    if (key < node.key) {
      node.left = this.remove(key, node.left);
      return node;
    } else if (key > node.key) {
      node.right = this.remove(key, node.right);
      return node;
    } else {
      if (node.left == null && node.right == null) {
        node = null;
        return node;
      }
      if (node.left == null) {
        node = node.right;
        return node;
      } else if (node.right == null) {
        node = node.left;
        return node;
      }
      const aux = this.min(node.right);
			node.key = aux.key;
      node.right = this.remove(node.right);
      return node;
    }
  }
  
  min(node = this.root) {
    if (node == null) return null;
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }
  
  max(node = this.root) {
    if (node == null) return null;
    let current = node;
    while (current.right) {
      current = current.right;
    }
    return current;
  }
  
  // RR 左旋
  leftRotate() {
    
  }
  
  // LL 右旋
  rightRotate() {
    
  }
  
  // LR 先右旋再左旋
  leftRightRotate() {
    
  }
  
  // RL 先左旋再右旋
  rightLeftRotate() {
    
  }
  
  
  
}
```

