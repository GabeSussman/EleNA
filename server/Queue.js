class Queue {
    constructor() {
        this.queue = {}
    }

    // add or replace node
    enq(val, dist, p){
        this.queue[val.id] = {node: val, dist: dist, par: p}
    }

    // return and delete node with lowest priority
    deq(){
        let min = Infinity
        let id = -1
        for(let key in this.queue){
            if(this.queue[key].dist < min){
                min = this.queue[key].dist
                id = key
            }
        }
        let node = this.queue[id]
        delete this.queue[id]
        return node
    }

    // return true if queue is empty
    isEmpty(){
        return Object.keys(this.queue).length === 0
    }

    // check if there is the same node with a lower dist in queue
    lower(id, dist){
        for(let key in this.queue){
            if(key == id){
                if(this.queue[key].dist < dist){
                    return true
                }
            }
        }
        return false
    }

}

module.exports = Queue