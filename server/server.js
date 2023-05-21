const express = require('express')
const app = express()
const Queue = require('./Queue')
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://user:ytnsGNoez@cluster0.v7lea8f.mongodb.net/?retryWrites=true&w=majority"

app.get("/api", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json("test")
})

;(async () => {
    // connect to mongodb and get non elev nodes
    const client = new MongoClient(uri)
    client.connect
    let db = client.db('geo')
    let collAll = db.collection('geoAll')
    let geoAll = await collAll.find().toArray()
    client.close

    // convert nearest nodes to dictionary
    let dictAll = nodesToDict(geoAll)

    // run aStar and trace path
    let start = dict[61795906]
    let end = dict[2264382646]
    //let end = dict[6357577436]
    let close = aStar(dictAll, start, end)
    let tracer = trace(close)
    //console.log(tracer)

    // run aStarElev and trace path
    let dist = tracer[0].dist
    //console.log(dist)
    let closeElev = aStarElev(dictAll, start, end, 'min', dist*1.5)
    //console.log(closeElev)
    let tracerElev = trace(closeElev)
    //console.log(tracerElev)

    var e = 0
    for(let i = 1; i < tracer.length - 2; i++){
        ev = Math.abs(tracer[i].node.elev - tracer[i+1].node.elev)
        //console.log(ev)
        e += ev
    }
    console.log(e)

    var e = 0
    for(i in tracerElev){
        //console.log(tracerElev[i].eChan)
        if(tracerElev[i].eChan != undefined){
            e += tracerElev[i].eChan
        }
    }
    console.log(e)

    console.log('finished');
})()


app.listen(5000, () => {console.log("Server started on port 5000")})

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
                if(!open.change(succ[node], ec, m) && dist < maxDist){
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

function nearest(nodes, ){
    // determine nearby nodes for each node save as dict
    dict = {}
    // for every node1
    for(let node1 in nodes){
        //yconsole.log(node1)
        let nNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let sNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let eNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let wNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let neNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let nwNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let seNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        let swNode = {'id': -1, 'distance': Infinity, par: nodes[node1].id}
        // for every other node2
        for(let node2 in nodes){
            if(nodes[node1].id != nodes[node2].id){
                let lat1 = nodes[node1].lat
                let lat2 = nodes[node2].lat
                let lon1 = nodes[node1].lon
                let lon2 = nodes[node2].lon
                // //console.log(lat1, lon1, lat2, lon2)

                // // calculate distance
                // const R = 6371000;
                // const lat1r = lat1 * Math.PI/180;
                // const lat2r = lat2 * Math.PI/180;
                // const latChange = (lat2-lat1) * Math.PI/180;
                // const lonChange = (lon2-lon1) * Math.PI/180;
                // const a = Math.sin(latChange/2) * Math.sin(latChange/2) +
                //         Math.cos(lat1r) * Math.cos(lat2r) *
                //         Math.sin(lonChange/2) * Math.sin(lonChange/2);
                // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                // const dist = R * c;

                let dist = coordDist(nodes[node1].lat, nodes[node2].lat, nodes[node1].lon, nodes[node2].lon)

                // calculate direction
                let threshLat = .0001;
                let threshLon = .0001;
                // if direction within some distance
                if(dist < 100){
                    // if long within theshold and lat > then north
                    if(Math.abs(lon1-lon2) < threshLon && lat2 > lat1){
                        if(dist < nNode['distance']){
                            nNode['id'] = nodes[node2].id;
                            nNode['distance'] = dist;
                        }
                    }
                    // elif long within theshold and lat < then south
                    else if(Math.abs(lon1-lon2) < threshLon && lat2 < lat1){
                        if(dist < sNode['distance']){
                            sNode['id'] = nodes[node2].id;
                            sNode['distance'] = dist;
                        }
                    }
                    // elif lat within thershold and long > then east
                    else if(Math.abs(lat1-lat2) < threshLat && lon2 > lon1){
                        if(dist < eNode['distance']){
                            eNode['id'] = nodes[node2].id;
                            eNode['distance'] = dist;
                        }
                    }
                    // elif lat within thershold and long < then west
                    else if(Math.abs(lat1-lat2) < threshLat && lon2 < lon1){
                        if(dist < wNode['distance']){
                            wNode['id'] = nodes[node2].id;
                            wNode['distance'] = dist;
                        }
                    }
                    // elif lat and long > then north east
                    else if(lat2 > lat1 && lon2 > lon1){
                        if(dist < neNode['distance']){
                            neNode['id'] = nodes[node2].id;
                            neNode['distance'] = dist;
                        }
                    }
                    // elif lat > long < then north west
                    else if(lat2 > lat1 && lon2 < lon1){
                        if(dist < nwNode['distance']){
                            nwNode['id'] = nodes[node2].id;
                            nwNode['distance'] = dist;
                        }
                    }
                    // elif lat < and long < then south west
                    else if(lat2 < lat1 && lon2 < lon1){
                        if(dist < swNode['distance']){
                            swNode['id'] = nodes[node2].id;
                            swNode['distance'] = dist;
                        }
                    }
                    // elif lat < and long > then south east
                    else if(lat2 < lat1 && lon2 > lon1){
                        if(dist < seNode['distance']){
                            seNode['id'] = nodes[node2].id;
                            seNode['distance'] = dist;
                        }
                    }
                    // else should never occur
                    else{   console.log("THIS SHOULDN'T HAPPEN"); 
                            console.log(lat1, lat2, lon1, lon2, nodes[node1].id, nodes[node2].id);}
                }
            }
        }
        // save nearest node in each direction dict[node1id] = [successors (as [node2id, dir])]
        dict[nodes[node1].id] = [nNode, eNode, sNode, wNode, neNode, seNode, swNode, nwNode];
    }
    return dict;
}

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