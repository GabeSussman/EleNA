class Queue {
    constructor() {
        this.queue = {}
    }

    // add or replace node
    enq(val, dist, p, elev, elevChange){
        if(elev == undefined){
            this.queue[val.id] = {node: val, dist: dist, par: p}
        } else {
            this.queue[val.id] = {node: val, dist: dist, par: p, elev: elev, eChan: elevChange}
        }
        
    }

    // return and delete node with min/max priority
    deqEle(type){
        let m = Infinity
        if(type == 'max'){
            m = -1
        }
        let id = -1
        for(let key in this.queue){
            if(type == 'max'){
                if(this.queue[key].eChan > m){
                    m = this.queue[key].eChan
                    id = key
                }
            } else {
                if(this.queue[key].eChan < m){
                    m = this.queue[key].eChan
                    id = key
                }
            }
        }
        let node = this.queue[id]
        delete this.queue[id]
        return node
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

    // check if there is the same node with a higher/lower eChan
    change(id, change, m){
        for(let key in this.queue){
            if(key == id){
                if(m == 'max'){
                    if(this.queue[key].eChan > change){
                        return true
                    }
                } else {
                    if(this.queue[key].eChan < change){
                        return true
                    }
                }
            }
        }
        return false
    }

}

module.exports = Queue