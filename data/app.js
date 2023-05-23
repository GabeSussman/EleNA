const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://user:ytnsGNoez@cluster0.v7lea8f.mongodb.net/?retryWrites=true&w=majority"

const overURL = 'https://overpass-api.de/api/interpreter?'
const elevURL = 'https://api.opentopodata.org/v1/ned10m?'

const southLat = 42.378890
const westLon = -72.542104
const NorthLat = 42.415273
const eastLon = -72.502940

;(async () => {
    // connect to mongo
    const client = new MongoClient(uri)
    await client.connect()
    // connect to geo db
    let db = client.db('geo')
    // connect to collection
    let collGeo = db.collection('geo')
    // delete data in collection and replace
    let res = getAll()
    let deleted = await collGeo.deleteMany()
    let result = await collGeo.insertMany(res)

    await client.close();

    console.log('Finsihed')
})()

// returns distance in meters between a two sets of latitude and longitude
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

// returns array of nodes including nearest node id in each direction
function nearest(nodes){
    // determine nearby nodes for each node save as array
    let arr = []
    const threshLat = .0001
    const threshLon = .0001
    const maxDist = 300
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

                let dist = coordDist(nodes[node1].lat, nodes[node2].lat, nodes[node1].lon, nodes[node2].lon)

                // calculate direction
                // if direction within some distance
                if(dist < maxDist){
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
        // save nearest node in each direction
        //dict[nodes[node1].id] = [nNode, eNode, sNode, wNode, neNode, seNode, swNode, nwNode];
        // arr = arr.concat([{id: nodes[node1].id, lat: nodes[node1].lat, lon: nodes[node1].lon, 
        //     n: nNode['id'], e: eNode['id'], s: sNode['id'], w: wNode['id'],
        //     ne: neNode['id'], se: seNode['id'], sw: swNode['id'], nw: nwNode['id']}])
        arr = arr.concat([{id: nodes[node1].id, lat: nodes[node1].lat, lon: nodes[node1].lon, elev: nodes[node1].elev,
            near: [nNode['id'], eNode['id'], sNode['id'], wNode['id'],
                    neNode['id'], seNode['id'], swNode['id'], nwNode['id']]}])
    }
    return arr;
}

// returns array of geo data nodes gotten from overpass api
async function getNodes(){
    // fetch builings as ways
    const api = await fetch(overURL, {
        method: 'POST',
        //body: 'data=[out:json][timeout:90];way(42.378890,-72.542104,42.415273,-72.502940)[building];out;'
        body: 'data=[out:json][timeout:90];way('.concat(southLat).concat(',').concat(westLon).concat(',').concat(NorthLat).concat(',').concat(eastLon).concat(')[building];out;')
    });
    // fetch nodes 
    const api2 = await fetch(overURL, {
        method: 'POST',
        //body: 'data=[out:json][timeout:90];node(42.378890,-72.542104,42.415273,-72.502940)[!building][amenity != parking][!leisure];out;'
        body: 'data=[out:json][timeout:90];node('.concat(southLat).concat(',').concat(westLon).concat(',').concat(NorthLat).concat(',').concat(eastLon).concat(')[!building][amenity != parking][!leisure];out;')
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

    return nodes
}

// helper function to get elevation data
async function getElevHelp(url){
    const api = await fetch(url)
    const elev = await api.json()
    return elev
}

// waits 1 sec before continuing execution
function wait(){
    return new Promise(resolve => {
        setTimeout(resolve, 1000)
    })
}

// gets elevation data for all nodes and returns array of nodes containing original information plus elevation
async function getElev(nodes){
    let b = 'locations='
    let arr = []
    for(let n = 0; n < nodes.length; n++){
        b = b.concat(nodes[n].lat).concat(',').concat(nodes[n].lon).concat('|')
        if(n != 0){
            if(n % 99 == 0 || n == nodes.length){
                //console.log(n)
                url = elevURL.concat(b)
                b = 'locations='
                    // get elevation data for b nodes
                    let elev = await getElevHelp(url)
                    //console.log(elev)
                    //console.log(url)
                    let res = elev['results']
                
                    // starting sub for nodes = n - results length
                    start = n - res.length + 1
                    // loop through results
                    for(let i = 0; i < res.length; i++){
                        // configure and add node object to arr
                        let node = {id: nodes[start+i].id, lat: nodes[start+i].lat, lon: nodes[start+i].lon, elev: res[i].elevation}
                        arr = arr.concat([node])
                    }
                    // wait 1s per elev api requirements
                    await wait()
            }
        }
    }
    return arr
}

// combines all data
async function combine(nodes, elev){
    let arr = []
    for(n in elev){
        arr = arr.concat([{id: nodes[n].id, lat: nodes[n].lat, lon: nodes[n].lon, near: nodes[n].near, elev: elev[n].elev}])
    }
    return arr
}

// get all data 
async function getAll(){
    let nodes = await getNodes()
    let elev = await getElev(nodes)
    let near = nearest(elev)
    return near
}