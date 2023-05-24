//import astar from './astar';

const {aStar} = require('./server.js');
const {trace} = require('./server.js');

const nodes = require('./nodes.json');
let start = {
  id: 61795906,
  lat: 42.392661,
  lon: -72.533839,
  near: [
      61792719, 1701851314,
    6348628584, 6348628582,
    1626446866, 1701851312,
    2296737950, 6348628580
  ],
  elev :  53.15987014770508
}
let end =
{
id: 6357577436,
lat: 42.3931953,
lon: -72.5317209,
near: [
  6357577437,
  6343662376,
  3151897192,
  2296737960,
  3151897175,
  6348628619,
  6348628610,
  6945482690
],
elev: 60.5369987487793
}
let close = [
  {
    node: {
      id: 61795906,
      lat: 42.392661,
      lon: -72.533839,
      near: [Array],
      elev: 53.15987014770508
    },
    dist: 183.8084888916142,
    par: undefined
  },
  {
    node: {
      id: 1626446866,
      lat: 42.3928029,
      lon: -72.5333034,
      near: [Array],
      elev: 53.54713439941406
    },
    dist: 183.8158090689577,
    par: {
      id: 61795906,
      lat: 42.392661,
      lon: -72.533839,
      near: [Array],
      elev: 53.15987014770508
    }
  },
  {
    node: {
      id: 1701851314,
      lat: 42.3926952,
      lon: -72.5337203,
      near: [Array],
      elev: 53.14358901977539
    },
    dist: 183.81865633955874,
    par: {
      id: 61795906,
      lat: 42.392661,
      lon: -72.533839,
      near: [Array],
      elev: 53.15987014770508
    }
  },
  {
    node: {
      id: 61792105,
      lat: 42.3927146,
      lon: -72.5336529,
      near: [Array],
      elev: 53.2132568359375
    },
    dist: 183.82490052487609,
    par: {
      id: 1701851314,
      lat: 42.3926952,
      lon: -72.5337203,
      near: [Array],
      elev: 53.14358901977539
    }
  },
  {
    node: {
      id: 6348628585,
      lat: 42.392963,
      lon: -72.5331925,
      near: [Array],
      elev: 53.99396896362305
    },
    dist: 186.80702690668954,
    par: {
      id: 61792105,
      lat: 42.3927146,
      lon: -72.5336529,
      near: [Array],
      elev: 53.2132568359375
    }
  },
  {
    node: {
      id: 1626446867,
      lat: 42.3929607,
      lon: -72.5329517,
      near: [Array],
      elev: 54.563533782958984
    },
    dist: 187.3910487966349,
    par: {
      id: 6348628585,
      lat: 42.392963,
      lon: -72.5331925,
      near: [Array],
      elev: 53.99396896362305
    }
  },
  {
    node: {
      id: 3151897180,
      lat: 42.3926648,
      lon: -72.5333004,
      near: [Array],
      elev: 53.833126068115234
    },
    dist: 187.60635636014413,
    par: {
      id: 1701851314,
      lat: 42.3926952,
      lon: -72.5337203,
      near: [Array],
      elev: 53.14358901977539
    }
  },
  {
    node: {
      id: 6357566400,
      lat: 42.3927082,
      lon: -72.5332161,
      near: [Array],
      elev: 53.739173889160156
    },
    dist: 187.75434034622026,
    par: {
      id: 3151897180,
      lat: 42.3926648,
      lon: -72.5333004,
      near: [Array],
      elev: 53.833126068115234
    }
  },
  {
    node: {
      id: 2296737954,
      lat: 42.3927503,
      lon: -72.5330587,
      near: [Array],
      elev: 54.08213424682617
    },
    dist: 187.78970771715072,
    par: {
      id: 6357566400,
      lat: 42.3927082,
      lon: -72.5332161,
      near: [Array],
      elev: 53.739173889160156
    }
  },
  {
    node: {
      id: 3151897179,
      lat: 42.3927519,
      lon: -72.5331314,
      near: [Array],
      elev: 53.907386779785156
    },
    dist: 187.83899621906528,
    par: {
      id: 1626446866,
      lat: 42.3928029,
      lon: -72.5333034,
      near: [Array],
      elev: 53.54713439941406
    }
  },
  {
    node: {
      id: 2296737955,
      lat: 42.3927992,
      lon: -72.532854,
      near: [Array],
      elev: 54.48464584350586
    },
    dist: 187.91557055648863,
    par: {
      id: 2296737954,
      lat: 42.3927503,
      lon: -72.5330587,
      near: [Array],
      elev: 54.08213424682617
    }
  },
  {
    node: {
      id: 6307218533,
      lat: 42.3929871,
      lon: -72.5331769,
      near: [Array],
      elev: 54.16778564453125
    },
    dist: 187.9870790183263,
    par: {
      id: 6348628585,
      lat: 42.392963,
      lon: -72.5331925,
      near: [Array],
      elev: 53.99396896362305
    }
  },
  {
    node: {
      id: 2296737956,
      lat: 42.3928634,
      lon: -72.5328821,
      near: [Array],
      elev: 54.56943893432617
    },
    dist: 188.13641144535848,
    par: {
      id: 3151897179,
      lat: 42.3927519,
      lon: -72.5331314,
      near: [Array],
      elev: 53.907386779785156
    }
  },
  {
    node: {
      id: 2296737957,
      lat: 42.3928978,
      lon: -72.5327379,
      near: [Array],
      elev: 54.994449615478516
    },
    dist: 188.15928656065023,
    par: {
      id: 2296737956,
      lat: 42.3928634,
      lon: -72.5328821,
      near: [Array],
      elev: 54.56943893432617
    }
  },
  {
    node: {
      id: 6357577430,
      lat: 42.3929083,
      lon: -72.5326963,
      near: [Array],
      elev: 55.12367248535156
    },
    dist: 188.16358645609102,
    par: {
      id: 2296737957,
      lat: 42.3928978,
      lon: -72.5327379,
      near: [Array],
      elev: 54.994449615478516
    }
  },
  {
    node: {
      id: 2296737952,
      lat: 42.3926616,
      lon: -72.5332229,
      near: [Array],
      elev: 53.877593994140625
    },
    dist: 188.36656345200393,
    par: {
      id: 3151897180,
      lat: 42.3926648,
      lon: -72.5333004,
      near: [Array],
      elev: 53.833126068115234
    }
  },
  {
    node: {
      id: 2296737953,
      lat: 42.3927055,
      lon: -72.5330391,
      near: [Array],
      elev: 54.090354919433594
    },
    dist: 188.53128816038168,
    par: {
      id: 2296737952,
      lat: 42.3926616,
      lon: -72.5332229,
      near: [Array],
      elev: 53.877593994140625
    }
  },
  {
    node: {
      id: 6307218532,
      lat: 42.3930818,
      lon: -72.5329426,
      near: [Array],
      elev: 55.176448822021484
    },
    dist: 188.7519613217729,
    par: {
      id: 6348628585,
      lat: 42.392963,
      lon: -72.5331925,
      near: [Array],
      elev: 53.99396896362305
    }
  },
  {
    node: {
      id: 6357566415,
      lat: 42.3928552,
      lon: -72.5328218,
      near: [Array],
      elev: 54.6312255859375
    },
    dist: 188.91806170198066,
    par: {
      id: 2296737956,
      lat: 42.3928634,
      lon: -72.5328821,
      near: [Array],
      elev: 54.56943893432617
    }
  },
  {
    node: {
      id: 6348628586,
      lat: 42.3930739,
      lon: -72.5329028,
      near: [Array],
      elev: 55.2641716003418
    },
    dist: 189.01150823730677,
    par: {
      id: 6307218532,
      lat: 42.3930818,
      lon: -72.5329426,
      near: [Array],
      elev: 55.176448822021484
    }
  },
  {
    node: {
      id: 6357566419,
      lat: 42.3926969,
      lon: -72.5329855,
      near: [Array],
      elev: 54.121002197265625
    },
    dist: 189.56746841827822,
    par: {
      id: 2296737953,
      lat: 42.3927055,
      lon: -72.5330391,
      near: [Array],
      elev: 54.090354919433594
    }
  },
  {
    node: {
      id: 6357566416,
      lat: 42.3927358,
      lon: -72.5327781,
      near: [Array],
      elev: 54.43147659301758
    },
    dist: 190.16514285025482,
    par: {
      id: 6357566419,
      lat: 42.3926969,
      lon: -72.5329855,
      near: [Array],
      elev: 54.121002197265625
    }
  },
  {
    node: {
      id: 6357566414,
      lat: 42.3929103,
      lon: -72.532867,
      near: [Array],
      elev: 54.63945770263672
    },
    dist: 190.55634635266227,
    par: {
      id: 2296737956,
      lat: 42.3928634,
      lon: -72.5328821,
      near: [Array],
      elev: 54.56943893432617
    }
  },
  {
    node: {
      id: 6357566401,
      lat: 42.3926383,
      lon: -72.5331563,
      near: [Array],
      elev: 53.99876403808594
    },
    dist: 190.69642400947015,
    par: {
      id: 2296737952,
      lat: 42.3926616,
      lon: -72.5332229,
      near: [Array],
      elev: 53.877593994140625
    }
  },
  {
    node: {
      id: 6357577429,
      lat: 42.3929173,
      lon: -72.5321944,
      near: [Array],
      elev: 58.80235290527344
    },
    dist: 191.11166275648972,
    par: {
      id: 6357566416,
      lat: 42.3927358,
      lon: -72.5327781,
      near: [Array],
      elev: 54.43147659301758
    }
  },
  {
    node: {
      id: 6945482689,
      lat: 42.3930332,
      lon: -72.5320775,
      near: [Array],
      elev: 59.20088195800781
    },
    dist: 191.89419429512563,
    par: {
      id: 6357577429,
      lat: 42.3929173,
      lon: -72.5321944,
      near: [Array],
      elev: 58.80235290527344
    }
  },
  {
    node: {
      id: 6357577436,
      lat: 42.3931953,
      lon: -72.5317209,
      near: [Array],
      elev: 60.5369987487793
    },
    dist: 191.89419429512563,
    par: {
      id: 6945482689,
      lat: 42.3930332,
      lon: -72.5320775,
      near: [Array],
      elev: 59.20088195800781
    }
  }
]




test(' testing astar function output random', () => {

  let aStarOutput = aStar(nodes, start, end);
  expect(aStarOutput.length).toBe(close.length);
});

test(' testing astar function output random id', () => {

  let aStarOutput = aStar(nodes, start, end);
  console.log(aStarOutput[0].node.id)
  expect(aStarOutput[0].node.id).toBe(61795906);
});

test(' testing astar function output random distance', () => {

  let aStarOutput = aStar(nodes, start, end);
  console.log(aStarOutput[0].node.id)
  expect(aStarOutput[1].dist).toBe(183.8158090689577);
});

test(' testing trace function output length ' , () => {
  console.log(trace(close));
  expect(trace(close).length).toBe(10);
});

test(' testing trace function random id ' , () => {
  console.log(trace(close));
  expect(trace(close)[3].node.id).toBe(6357566416);
});

