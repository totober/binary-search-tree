// NODE:   
   
    class Node {

        constructor(value, left, right){
            this.value = value /* || null; */;
            this.left = left /* || null; */;
            this.right = right /* || null; */;
        }
    }

// TREE:
    
class Tree {

    constructor(array) {
        this.array = this.#orderAndFilter(array);
        this.root = this.buildTree(this.array);
    };

    #orderAndFilter(array) {

        let orderedArr = this.#mergeSort(array);

        let orderedFilteredArr = [];

        for(let i = 0; i < orderedArr.length; i++){

            if(orderedArr[i] === orderedArr[i + 1]) continue;

            orderedFilteredArr.push(orderedArr[i]);
        };

        return orderedFilteredArr;
    };

    #mergeSort(arr) {

        let half = arr.length / 2;
        
        if(arr.length === 1) return arr;
        
        let left = arr.splice(0, half);
        let right = arr.splice(0);
        
        return this.#merge(this.#mergeSort(left), this.#mergeSort(right));
    };

    #merge(left, right) {

        let mergedArr = [];
        
        let l = 0;
        let r = 0;
        
        while (left.length > l && right.length > r){
        
            if(left[l] < right[r]){
            
                mergedArr.push(left[l]);
                l++;
            }; 
            
            if(right[r] <= left[l]){
            
                mergedArr.push(right[r]);
                r++;
            };
        };
        
        while(left.length > l) {
        
            mergedArr.push(left[l]);
            l++;
        };
        
        while(right.length > r) {
            mergedArr.push(right[r]);
            r++;
        };
        
        return mergedArr;
    };

    buildTree(array, start = 0, end = array.length - 1){

        if(start > end) return null;

        let half = Math.floor((start + end) / 2);

        let node = new Node(array[half]);

        node.left = this.buildTree(array, start, half - 1);
        node.right = this.buildTree(array, half + 1, end);

        return node;
    };

    prettyPrint (node = this.root, prefix = "", isLeft = true) {

        if (node === null) {
            return;
        };

        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        };

        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);

        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        };
    };

    #traverse(value){

        let node = this.root;

        let i = 0;

        let queue = [node];

        while( node !== null && value !== node.value && i < this.array.length){

            i++;

            if(value < node.value) {
                
                node = node.left;

                queue.push(node);
                continue;
            };

            if(value > node.value) {

                node = node.right;

                queue.push(node);
                continue;
            }; 
        };

        return {node, queue, i};
    }

    find(value) {

        if( typeof value !== "number") return null;

        let {node} = this.#traverse(value);

        return node;
    };

    insert(value){

        let {queue} = this.#traverse(value);

        let current = queue.pop();
        let prev = queue.pop();

        if(current !== null) return console.error("node already exists!");

        if(value > prev.value) prev.right = new Node(value, null, null);

        if(value < prev.value) prev.left = new Node(value, null, null);
    };

    deleteRight(value) {

        let {queue} = this.#traverse(value);

        let current = queue.pop();
        let prev =  typeof queue[queue.length - 1] === "undefined" ? null : queue.pop(); 

        if(current === null) return console.error("node doesn't exist!");

        let currentRight = current.right;
        let currentLeft = current.left;

        if(prev === null || value > prev.value) {

            if(currentLeft === null && currentRight === null) return prev.right = null;         

            if(currentRight.left === null) {

                    prev.right = currentRight;
                    currentRight.left = currentLeft;
                    return;
                };

            let prevLoop = null;
            let currentLoop = currentRight;

            while(currentLoop.left !== null) {

                prevLoop = currentLoop;
                currentLoop = currentLoop.left;
            };

            current.value = currentLoop.value;
            prevLoop.left = currentLoop.right;

            return;
        };

        if(value < prev.value) {

            if(currentLeft === null && currentRight === null) return prev.left = null;
                
            if(currentRight.left === null) {

                prev.left = currentRight;
                currentRight.left = currentLeft;
                return;
            };

            let prevLoop = null;
            let currentLoop = currentRight;

            while(currentLoop.left !== null) {

                prevLoop = currentLoop;
                currentLoop = currentLoop.left;
            };

            current.value = currentLoop.value;
            prevLoop.left = currentLoop.right;

            return;
        } 
    }

    deleteLeft(value) {


        let {queue} = this.#traverse(value);

        let current = queue.pop();
        let prev = typeof queue[queue.length - 1] === "undefined" ? null : queue.pop(); 

        if(current === null) return console.error("node doesn't exist!");


        let currentRight = current.right;
        let currentLeft = current.left;

        if(prev === null || value > prev.value) {

            if(currentLeft === null && currentRight === null) return prev.right = null;
               
            if(currentLeft.right === null) {

                prev.right = currentLeft;
                currentLeft.right = currentRight;
                return;
            };

            let prevLoop = null;
            let currentLoop = currentLeft;

            while(currentLoop.right !== null) {

                prevLoop = currentLoop;
                currentLoop = currentLoop.right;
            };

            current.value = currentLoop.value;
            prevLoop.right = currentLoop.left;

            return;
        };

        if(value < prev.value) {

            if(currentLeft === null && currentRight === null) return prev.left = null;
                
            if(currentLeft.right === null) {

                prev.left = currentLeft;
                currentLeft.right = currentRight;
                return;
            };

            let prevLoop = null;
            let currentLoop = currentLeft;

            while(currentLoop.right !== null) {

                prevLoop = currentLoop;
                currentLoop = currentLoop.right;
            };

            current.value = currentLoop.value;
            prevLoop.right = currentLoop.right;

            return;
        }; 
    };

    levelOrderRecursive(cb, node = this.root, queue = [], arr = []){     

        if(node.left !== null) queue.push(node.left);

        if(node.right !== null) queue.push(node.right);

        cb ? arr.push(cb(node)) : arr.push(node);

        if(queue.length <= 0) return;

        this.levelOrderRecursive(cb, queue.shift(), queue, arr);

        return arr;
    };

    levelOrderLoop(cb){

       let arr = [];
       let queue = [this.root];

        while (queue.length > 0){

            let current = queue[0];

            if(current.left !== null){
                queue.push(current.left);
            };

            if(current.right !== null){
                queue.push(current.right);
            };

            cb ? arr.push(cb(queue.shift())) : arr.push(queue.shift());
        };
       
        return arr;
    };

    levelOrderLoopArr(node = this.root) {

        let arr = [];
        let queue = [node];

        while(queue.length > 0) {

            let subArr = [];
            let len = queue.length;
            

            for(let i = 0; i < len; i++) {

            let current = queue.shift();

            subArr.push(current);
                
            if(current.left !== null) queue.push(current.left);

            if(current.right !== null) queue.push(current.right);

            };

            arr.push(subArr);
        };

        return arr;
    };

    preOrder(cb, node = this.root, arr = []) {    

        if(node === null) return;

        cb ? arr.push(cb(node)) : arr.push(node);

        this.preOrder(cb, node.left, arr);
            
        this.preOrder(cb, node.right, arr);

        return arr;
    };   

    postOrder(cb, node = this.root, arr = []) {    

        if(node === null) return;

        this.postOrder(cb, node.left, arr);
            
        this.postOrder(cb, node.right, arr);

        cb ? arr.push(cb(node)) : arr.push(node);

        return arr;
    };

    inOrder(cb, node = this.root, arr = []) {    

        if(node === null) return;

            this.inOrder(cb, node.left, arr);
        
            cb ? arr.push(cb(node)) : arr.push(node);

            this.inOrder(cb, node.right, arr);

        return arr;
    };

    preOrderLoop(cb){

        let stack = [this.root];
        let arr = [];

        while(stack.length > 0){

            let node = stack[stack.length - 1];
            cb ? arr.push(cb(stack.pop())) : arr.push(stack.pop());

            if(node.right !== null) stack.push(node.right);

            if(node.left !== null) stack.push(node.left);

        };
         
        return arr;
    };

    postOrderLoop(cb) {

        let stack = [this.root];
        let arr = [];

        while(stack.length > 0) {

            let node = stack[stack.length - 1];
            cb ? arr.unshift(cb(stack.pop())) : arr.unshift(stack.pop());

            if(node.left !== null) stack.push(node.left);

            if(node.right !== null) stack.push(node.right);
          
        };

        return arr;
    };

    inOrderLoop(cb) {

        let node = this.root;
        let stack = [];
        let arr = [];

        while(stack.length > 0 || node !== null) {

           while(node !== null) {
            stack.push(node);
            node = node.left;
           };

            node = stack.pop();
            cb ? arr.push(cb(node)) : arr.push(node);
            node = node.right;
        };

        return arr;
    };


    heightLoop(value = this.root.value){

        let node = this.find(value);

        if(node === null) return console.error("node doesn't exist!");

        let arr = this.levelOrderLoopArr(node);

        let i = arr.length;

        while(arr.length > 0) {

            i--;
            let subArr = arr.shift();

            for(let j = 0; j < subArr.length; j++) {

                if(subArr[j].value === node.value) return i;

            };
        };
    };

    depthLoop(value = this.root.value){

        let node = this.find(value);

        if(node === null) return console.error("node doesn't exist!");

        let arr = this.levelOrderLoopArr(this.root);

        let i = -1;

        while(arr.length > 0) {

            i++;

            let subArr = arr.shift();

            for(let j = 0; j < subArr.length; j++) {

                if(subArr[j].value === node.value) return i;
            };
        };
    };

    heightRecursive(value) {

        let node = this.find(value);

        if(node === null) return console.error("node doesn't exist!");

        return this.#heightRec(node);
    };

    #heightRec(node = this.root){

        if(node === null) return -1;

        let leftHeight = this.#heightRec(node.left);

        let rightHeight = this.#heightRec(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    };

    depthRecursive(value, node = this.root) {

        if(node === null) return -1;

        if(node.value === value) return 0;


        if(value < node.value) {

            let left = this.depthRecursive(value, node.left);

            if(left === -1) return -1;

            return left + 1;
        };

        if(value > node.value) {

            let right = this.depthRecursive(value, node.right);

            if(right === -1) return -1;

            return right + 1;
        };    
    };

    isBalanced(node = this.root) {

        if(node === null) return 0;

        let left = this.isBalanced(node.left);
        if(left === -1) return -1;

        let right = this.isBalanced(node.right);
        if(right === -1) return -1;

        if(Math.abs(left - right) > 1) return -1;

        return Math.max(left, right) + 1;
    };

    isSymmetric(node = this.root) {

        if(node === null) return  0;

        let left = this.isSymmetric(node.left);
        if(left === -1) return -1;

        let right = this.isSymmetric(node.right);
        if(right === -1) return -1;

        if(Math.abs(left - right) >= 1) return -1;

        return Math.max(left, right) + 1;
    };

    rebalance(){

        let arr = [];

        this.levelOrderRecursive().forEach(node => arr.push(node.value));

        this.array = this.#orderAndFilter(arr);

        this.root = this.buildTree(this.array);
    };

    rebalance2() {

        this.array = [];
        
        this.inOrder().forEach(node => this.array.push(node.value));

        this.root = this.buildTree(this.array);
    }; 
};





function mulVal(node){
return node.value * 2
}


let order = [1,2,3,4]
let order2 = [1,2,3,4,5,6,7]
let order3 = [1,2,3,4,5,6,7, 8]
let order4 = [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]
let order5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
let unorder = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]



let a = new Tree(order2)




