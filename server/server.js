const express = require('express')
const app = express()
const Queue = require('./Queue')
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://user:ytnsGNoez@cluster0.v7lea8f.mongodb.net/?retryWrites=true&w=majority"
const southLat = 42.378890
const westLon = -72.542104
const northLat = 42.415273
const eastLon = -72.502940
// expected example /routes/42.392661/-72.533839/42.3931953/-72.5317209/max/.5
// waits for call and returns route
app.get("/routes/:startLat/:startLon/:endLat/:endLon/:choice/:percent", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // check start and end in bounds
    if(req.params.startLat > southLat && req.params.startLat < northLat && 
        req.params.startLon > westLon && req.params.startLon < eastLon &&
        req.params.endLat > southLat && req.params.endLat < northLat && 
        req.params.endLon > westLon && req.params.endLon < eastLon){
    // connect to mongodb and get non elev nodes
    const client = new MongoClient(uri)
    client.connect
    let db = client.db('geo')
    let collAll = db.collection('geo')
    let geoAll = collAll.find().toArray()
    client.close
    geoAll.then((data) => {
        // convert nodes to dictionary
        let nodes = nodesToDict(data)
        // get start and end nodes as closest lat lon
        let start = nodes[nearest(req.params.startLat, req.params.startLon, data)]
        let end = nodes[nearest(req.params.endLat, req.params.endLon, data)]
        let m = req.params.choice
        let per = req.params.percent
        // calculate shortest distance path
        let close = aStar(nodes, start, end)
        let shortPath = trace(close)
        let shortDist = shortPath[0].dist
        // calculate min/max elevation path
        let closeElev = aStarElev(nodes, start, end, m, shortDist * (1+parseFloat(per)))
        let path = trace(closeElev)
        if(parseFloat(per) == 0){
            res.json(trim(shortPath))
        } else{
            res.json(trim(path))
        }

    })
    } else {
        res.json('Error, start or end coordinate is out of bounds')
    }
})

// ;(async () => {
//     // connect to db
//     const client = new MongoClient(uri)
//     client.connect
//     let db = client.db('geo')
//     let collAll = db.collection('geo')
//     let geoAll = collAll.find().toArray()
//     client.close
//     geoAll.then((data) => {
//         // convert nodes to dictionary
//         let nodes = nodesToDict(data)
//         // get start and end nodes as closest lat lon
//         let start = nodes[nearest(42.392661, -72.533839, data)]
//         let end = nodes[nearest(42.3931953, -72.5317209, data)]
//         let m = 'min'
//         let per = .5
//         // calculate shortest distance path
//         let close = aStar(nodes, start, end)
//         let shortPath = trace(close)
//         let shortDist = shortPath[0].dist
//         // calculate min/max elevation path
//         let closeElev = aStarElev(nodes, start, end, m, shortDist * (1+per))
//         let path = trace(closeElev)
//         console.log(path.length)
//         console.log(distChange(shortPath))
//         console.log(distChange(path))
//     })
// })()


app.listen(5001, () => {console.log("Server started on port 5001")})

function distChange(path){
    let e = 0
    let dist = path[0].dist
    for(let i = 0; i < path.length - 2; i++){
        e += Math.abs(path[i].node.elev - path[i+1].node.elev)
    }
    return [e, dist]
}

// takes latitude, longitude and nodes and returns id for nearest node 
function nearest(lat, lon, nodes){
    let minDist = Infinity
    let id = -1
    for(n in nodes){
        let dist = coordDist(lat, nodes[n].lat, lon, nodes[n].lon)
        if(dist < minDist){
            id = nodes[n].id
            minDist = dist
        }
    }
    return id
}

// takes dictionary of nodes, start node, end node, m = 'min' or 'max' and max distance
// returns an array of checked nodes which can be traced through parents to get route
function aStarElev(nodes, start, end, m, maxDist){
    // m either 'max' or 'min'
    // init open and close list
    let open = new Queue()
    let close = []
    // push start to open
    open.enq(start, coordDist(start.lat, end.lat, start.lon, end.lon), undefined, start.elev, 0)
    // while open ! empty
    let done = false
    while(!open.isEmpty() && !done){
        // n = pop open node with smallest f
        let n = open.deqEle(m)
        // generate successors
        succ = n.node.near
        // compute dist estimate for each successor
        for(let node in succ){
            if(succ[node] != -1){
                // check if end node
                //console.log(n.node.id)
                if(nodes[succ[node]].lat == end.lat && nodes[succ[node]].lon == end.lon){
                    done = true
                    close = close.concat([n, {node: nodes[succ[node]], dist: n.dist, par: n.node}])
                    break
                }
                // dist computation
                dist = n.dist + coordDist(n.node.lat, nodes[succ[node]].lat, n.node.lon, nodes[succ[node]].lon) - coordDist(n.node.lat, end.lat, n.node.lon, end.lon)
                dist += coordDist(nodes[succ[node]].lat, end.lat, nodes[succ[node]].lon, end.lon)
                // if succ in open or close with lower dist skip
                // check dist within maxDist
                // calculate elevation change 
                let el = nodes[succ[node]].elev
                let ec = Math.abs(el - n.elev)
                if(!open.lower(succ[node], dist) && dist < maxDist){
                    // if not in close
                    let t = false
                    for(let i = 0; i < close.length; i++){
                        if(succ[node] == close[i].node.id){
                            t = true
                        }
                    }
                    if(!t){
                        // add to queue
                        open.enq(nodes[succ[node]], dist, n.node, el, ec)
                    }
                }
            }
        }
        // push n to closed
        if(!done){ close = close.concat([n]) }
    }
    // return closed as path
    return close
}

// takes an array of nodes from routing algorithm and returns an array of nodes making up route
function trace(close){
    // loop through close(aStar return) following parent nodes to create path from start to end
    let trace = [close[close.length-1]]
    let par = close[close.length-1].par.id
    for(let i = close.length-1; i >=0; i--){
        if(i == 0){
            trace = trace.concat([close[i]])
        }
        else if(close[i].node.id == par){
            trace = trace.concat([close[i]])
            par = close[i].par.id
        }
    }
    return trace
}

// takes dictionary of nodes, start node and end node
// returns an array of checked nodes which can be traced through parents to get shortest route
function aStar(nodes, start, end){
    // init open and close list
    let open = new Queue()
    let close = []
    // push start to open
    open.enq(start, coordDist(start.lat, end.lat, start.lon, end.lon))
    // while open ! empty
    let done = false
    while(!open.isEmpty() && !done){
        // n = pop open node with smallest f
        let n = open.deq()
        // generate successors
        succ = n.node.near
        // compute dist estimate for each successor
        for(let node in succ){
            if(succ[node] != -1){
                // check if end node
                if(nodes[succ[node]].lat == end.lat && nodes[succ[node]].lon == end.lon){
                    done = true
                    close = close.concat([n, {node: nodes[succ[node]], dist: n.dist, par: n.node}])
                    break
                }
                // dist computation
                dist = n.dist + coordDist(n.node.lat, nodes[succ[node]].lat, n.node.lon, nodes[succ[node]].lon) - coordDist(n.node.lat, end.lat, n.node.lon, end.lon)
                dist += coordDist(nodes[succ[node]].lat, end.lat, nodes[succ[node]].lon, end.lon)
                // if succ in open or close with lower dist skip
                if(!open.lower(succ[node], dist)){
                    // if not in close
                    let t = false
                    for(let i = 0; i < close.length; i++){
                        if(succ[node] == close[i].node.id){
                            t = true
                        }
                    }
                    if(!t){
                        // add to queue
                        open.enq(nodes[succ[node]], dist, n.node)
                    }
                }
            }
        }
        // push n to closed
        if(!done){ close = close.concat([n]) }
    }
    // return closed as path
    return close
}

// takes two sets of latitude and longitude and returns the distance in meters between them
function coordDist(lat1, lat2, lon1, lon2){
    // calculate distance
    const R = 6371000;
    const lat1r = lat1 * Math.PI/180;
    const lat2r = lat2 * Math.PI/180;
    const latChange = (lat2-lat1) * Math.PI/180;
    const lonChange = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(latChange/2) * Math.sin(latChange/2) +
        Math.cos(lat1r) * Math.cos(lat2r) *
        Math.sin(lonChange/2) * Math.sin(lonChange/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// takes an array of nodes and returns it as a dictionary with node id as the key
function nodesToDict(nodes){
    dict = {}
    // loop through nodes to
    // convert from array of node objects to dict of node objects
    // with nodeid as key
    for(let node in nodes){
        dict[nodes[node].id] = {
            id: nodes[node].id,
            lat: nodes[node].lat,
            lon: nodes[node].lon,
            near: nodes[node].near,
            elev: nodes[node].elev
        }
    }
    return dict;
}

// trims a route returned from trace to just latitudes and longitudes
function trim(path){
    let arr = []
    for( let i in path){
        arr = arr.concat([{node: {lat: path[i].node.lat, lon: path[i].node.lon}}])
    }
    return arr
}

module.exports = {trace, aStar}