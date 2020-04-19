// TODO: express coordinates as fractions instead of pixels,
//       otherwise parametrizing the canvas size is pointless...
game.objects = {
  'branches': [
    {
      color: 'lightblue',
      name: 'sky',
      points: [
        {x: 0,  y: 0},
        {x: 1100,  y: 0},
        {x: 1100,  y: 600},
        {x: 0,  y: 600}
      ]
    },
    {
      color: '#da9f33',
      name: 'branch',
      outlined: true,
      outlineColor: '#423206',
      points: [
        {x: 0,  y: 0},
        {x: 125, y: 125},
        {x: 75,  y: 300},
        {x: 550,  y: 250},
        {x: 720,  y: 150},
        {x: 600,  y: 350},
        {x: 75,  y: 450},
        {x: 75,  y: 600},
        {x: 0,  y: 600},
      ]
    },
    {
      name: 'leaf0',
      outlined: true,
      outlineColor: '#034411',
      texture: 'leaf',
      points: [
        {x: 666,  y: 190},
        {x: 610,  y: 160},
        {x: 500,  y: 140},
        {x: 470,  y: 55},
        {x: 570,  y: 70},
        {x: 620,  y: 150},
      ]
    },
  ],
  'trunk': [
    {
      color: 'lightblue',
      name: 'sky',
      points: [
        {x: 0,  y: 0},
        {x: 1100,  y: 0},
        {x: 1100,  y: 600},
        {x: 0,  y: 600}
      ]
    },
    {
      color: 'brown',
      name: 'body',
      points: [
        {x: 0,  y: 0},
        {x: 600, y: 0},
        {x: 600, y: 600},
        {x: 0,  y: 600},
      ]
    },
    {
      color: 'black',
      name: 'bark',
      points: [
        {x: 600,  y: 0},
        {x: 650, y: 0},
        {x: 650, y: 600},
        {x: 600,  y: 600},
      ]
    },
  ],
  'roots': [
    {
      color: 'lightblue',
      name: 'sky',
      points: [
        {x: 0,  y: 0},
        {x: 1100,  y: 0},
        {x: 1100,  y: 600},
        {x: 0,  y: 600}
      ]
    },
    {
      color: 'green',
      name: 'cover',
      points: [
        {x: 0,  y: 100},
        {x: 1100, y: 100},
        {x: 1100, y: 200},
        {x: 0,  y: 200},
      ]
    },
    {
      color: 'brown',
      name: 'ground',
      points: [
        {x: 0,  y: 200},
        {x: 450,  y: 200},
        {x: 550,  y: 100},
        {x: 900,  y: 100},
        {x: 900,  y: 200},
        {x: 1100, y: 200},
        {x: 1100, y: 600},
        {x: 0,  y: 600},
      ]
    },
    {
      color: '#423206',
      name: 'tree',
      outlined: true,
      outlineColor: 'black',
      points: [
        {x: 600,  y: 0},
        {x: 550, y: 75},
        {x: 150, y: 225},
        {x: 300, y: 200},
        {x: 250, y: 350},
        {x: 200, y: 400},
        {x: 300, y: 350},
        {x: 350, y: 250},
        {x: 450, y: 300},
        {x: 400,  y: 400},
        {x: 700, y: 150},
        {x: 1100, y: 350},
        {x: 1100, y: 0},
      ]
    },
    {
      color: 'white',
      name: 'debug-box',
      points: [
        {x: 800,  y: 0},
        {x: 900,  y: 0},
        {x: 900,  y: 100},
        {x: 800,  y: 100}
      ]
    },
  ]
};
