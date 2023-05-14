const express = require('express')
const app = express()
const Queue = require('./Queue')
const overURL = 'https://overpass-api.de/api/interpreter?'

app.get("/api", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json("test")
})

;(async () => {
    // fetch builings as ways
    const api = await fetch(overURL, {
        method: 'POST',
        body: 'data=[out:json][timeout:90];way(42.378890,-72.542104,42.415273,-72.502940)[building];out;'
    });
    // fetch nodes 
    const api2 = await fetch(overURL, {
        method: 'POST',
        body: 'data=[out:json][timeout:90];node(42.378890,-72.542104,42.415273,-72.502940)[!building][amenity != parking][!leisure];out;'
    });
    const waysRet = await api.json();
    const nodesRet = await api2.json(); 
    let ways = waysRet['elements']
    let nodes = nodesRet['elements']

    // remove building nodes
    // for all ways
    for(let i = 0; i < ways.length; i++){
        // for all nodes per way
        if(Object.hasOwn(ways[i], 'nodes')){
        for( let j = 0; j < ways[i]['nodes'].length; j++){
            // for all nodes
            for(let node in nodes){
                // if id of waynode matches node then remove node
                if(nodes[node].id == ways[i]['nodes'][j]){ 
                    nodes.splice(node, 1); 
                    break; 
                }
            }
        }}
    }

    // remove duplicate nodes
    let index1 = 0;
    for(let node1 in nodes){
        for(let node2 in nodes){
            if(nodes[index1].id != nodes[node2].id && nodes[index1].lat == nodes[node2].lat && nodes[index1].lon == nodes[node2].lon){
                nodes.splice(index1, 1);
                --index1;
                break;
            }
        }
        ++index1
    }

    // get nearest nodes to each node and convert nodes to dictionary
    near = nearest(nodes);
    dict = nodesToDict(nodes);
    // run aStar and trace path
    let start = dict[61795906]
    let end = dict[6357577436]
    let close = aStar(start, end, dict, near)
    let tracer = trace(close, start, end)
    //console.log(tracer)

    console.log('finished');
})()

app.listen(5000, () => {console.log("Server started on port 5000")})

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

function aStar(start, end, nodes, near){
    // a star
    // take start and end nodes
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
        succ = near[n.node.id]
        // compute dist estimate for each successor
        for(let node in succ){
            if(succ[node]['id'] != -1){
                if(nodes[succ[node]['id']].lat == end.lat && nodes[succ[node]['id']].lon == end.lon){
                    done = true
                    close = close.concat([n, {node: nodes[succ[node]['id']], dist: n.dist + succ[node]['distance'], par: n.node}])
                    break
                }
                // dist from start to n + from n to succ
                dist = n.dist + succ[node]['distance'] - coordDist(n.node.lat, end.lat, n.node.lon, end.lon)
                // + estimate from succ to end
                //console.log(dist)
                dist += coordDist(nodes[succ[node]['id']].lat, end.lat, nodes[succ[node]['id']].lon, end.lon)
                //console.log(dist)
                // if succ in open or close with lower dist skip
                if(!open.lower(succ[node]['id'], dist)){
                    // if not in close
                    let t = false
                    for(let i = 0; i < close.length; i++){
                        if(succ[node]['id'] == close[i].id){
                            t = true
                        }
                    }
                    if(!t){
                        // add to queue
                        open.enq(nodes[succ[node]['id']], dist, n.node)
                    }
                }
            }
        }
        // push n to closed
        if(!done){
            //console.log(n)
            close = close.concat([n])
        }
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
            lon: nodes[node].lon
        }
    }
    return dict;
}