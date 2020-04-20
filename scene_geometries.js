// TODO: express coordinates as fractions instead of pixels,
//       otherwise parametrizing the canvas size is pointless...
game.objects = {
  'branches': [
    {
      color: 'lightblue',
      name: 'sky',
      points: [
        {x: 0, y: 0},
        {x: 1100, y: 0},
        {x: 1100, y: 600},
        {x: 0, y: 600}
      ]
    },
    {
      color: '#da9f33',
      name: 'branch',
      outlined: true,
      outlineColor: '#423206',
      points: [
        {x: 0, y: 0},
        {x: 165, y: 0},
        {x: 151, y: 61},
        {x: 169, y: 114},
        {x: 153, y: 193},
        {x: 163, y: 275},
        {x: 159, y: 334},
        {x: 306, y: 314},
        {x: 350, y: 266},
        {x: 381, y: 192},
        {x: 449, y: 154},
        {x: 394, y: 200},
        {x: 375, y: 273},
        {x: 515, y: 190},
        {x: 567, y: 149},
        {x: 576, y: 83},
        {x: 571, y: 169},
        {x: 525, y: 201},
        {x: 398, y: 296},
        {x: 648, y: 271},
        {x: 728, y: 320},
        {x: 801, y: 311},
        {x: 842, y: 228},
        {x: 880, y: 203},
        {x: 812, y: 335},
        {x: 724, y: 349},
        {x: 637, y: 303},
        {x: 547, y: 303},
        {x: 421, y: 334},
        {x: 284, y: 394},
        {x: 158, y: 455},
        {x: 156, y: 458},
        {x: 139, y: 477},
        {x: 135, y: 511},
        {x: 110, y: 600},
        {x: 0, y: 600},
      ]
    },
    {
      color: '#423206',
      name: 'branch_shade0',
      points: [
        {x: 399, y: 294},
        {x: 494, y: 243},
        {x: 570, y: 170},
      ]
    },
    {
      color: '#423206',
      name: 'branch_shade1',
      points: [
        {x: 573, y: 164},
        {x: 583, y: 90},
        {x: 599, y: 74},
        {x: 577, y: 82},
      ]
    },
    {
      color: '#423206',
      name: 'branch_shade2',
      points: [
        {x: 110, y: 600},
        {x: 161, y: 600},
        {x: 155, y: 549},
        {x: 167, y: 481},
        {x: 225, y: 441},
        {x: 330, y: 381},
        {x: 453, y: 327},
        {x: 421, y: 333},
        {x: 218, y: 423},
        {x: 157, y: 453},
        {x: 137, y: 475},
        {x: 133, y: 511},
      ]
    },
    {
      color: '#423206',
      name: 'branch_shade3',
      points: [
        {x: 853, y: 254},
        {x: 887, y: 208},
        {x: 918, y: 193},
        {x: 880, y: 200},
      ]
    },
    {
      color: '#423206',
      name: 'branch_shade4',
      points: [
        {x: 636, y: 302},
        {x: 764, y: 342},
        {x: 723, y: 348},
      ]
    },
    {
      color: '#906d0d',
      name: 'trunk_spot_right',
      points: [
        {x: 83, y: 385},
        {x: 121, y: 266},
        {x: 83, y: 168},
      ]
    },
    {
      color: '#423206',
      name: 'trunk_spot_left',
      points: [
        {x: 83, y: 385},
        {x: 67, y: 201},
        {x: 83, y: 168},
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
      color: 'rgb(182,141,116)',
      name: 'heartwood',
      points: [
        {x: 0,  y: 0},
        {x: 500, y: 0},
        {x: 500, y: 600},
        {x: 0,  y: 600},
      ]
    },
    {
      color: 'rgb(160,97,47)',
      name: 'sapwood',
      points: [
        {x: 500,  y: 0},
        {x: 615, y: 0},
        {x: 615, y: 600},
        {x: 500,  y: 600},
      ]
    },
    {
      color: 'rgb(76,39,17)',
      name: 'bark',
      points: [
        {x: 600, y:0},
        {x: 602, y:45},
        {x: 592, y:118},
        {x: 602, y:196},
        {x: 597, y:243},
        {x: 604, y:270},
        {x: 594, y:369},
        {x: 606, y:478},
        {x: 590, y:600},
        {x: 632, y:600},
        {x: 653, y:481},
        {x: 644, y:432},
        {x: 654, y:377},
        {x: 653, y:288},
        {x: 644, y:215},
        {x: 654, y:157},
        {x: 647, y:107},
        {x: 654, y:76},
        {x: 649, y:4},
        {x: 654, y:0},
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
  ]
};

game.leaf_locations = [
  {x: 390, y: 191, angle: 220 },
  {x: 427, y: 165, angle: 270 },
  {x: 438, y: 159, angle: 40 },
  {x: 570, y: 151, angle: 220 },
  {x: 848, y: 230, angle: 220 },
  {x: 871, y: 214, angle: 45 },
  {x: 657, y: 303, angle: 220 },
  {x: 597, y: 295, angle: 70 },
  {x: 637, y: 278, angle: 60 },
  {x: 151, y: 119, angle: 270 },
  {x: 150, y:  98, angle: 300 },
  {x: 148, y:  81, angle: 310 },
  {x: 159, y: 103, angle: 320 },
  {x: 150, y: 572, angle: 250},
  {x: 142, y: 554, angle: 310},
  {x: 147, y: 529, angle: 340},
  {x:  78, y: 263, angle: 190},
  {x:  78, y: 248, angle: 240},
  {x: 725, y: 345, angle: 15},
  {x: 744, y: 341, angle: 10},
  {x: 757, y: 338, angle: 20},
  {x: 801, y: 330, angle: 0},
  {x: 884, y: 205, angle: 0},
  {x: 896, y: 199, angle: 0},
  {x: 908, y: 197, angle: 200},
  {x: 908, y: 197, angle: 225},
  {x: 490, y: 292, angle: 213},
  {x: 509, y: 289, angle: 192},
  {x: 524, y: 288, angle: 187},
  {x: 545, y: 287, angle: 200},
  {x: 582, y: 282, angle: 192},
  {x: 560, y: 283, angle: 180},
  {x: 596, y: 280, angle: 192},
  {x: 688, y: 296, angle: 180},
  {x: 624, y: 277, angle: 213},
  {x: 750, y: 321, angle: 200},
  {x: 773, y: 315, angle: 180},
  {x: 808, y: 297, angle: 188},
  {x: 792, y: 317, angle: 300},
  {x: 822, y: 275, angle: 192},
  {x: 539, y: 174, angle: 180},
  {x: 521, y: 187, angle: 185},
  {x: 503, y: 196, angle: 213},
  {x: 374, y: 215, angle: 187},
  {x: 364, y: 239, angle: 192},
  {x: 357, y: 259, angle: 180},
  {x: 343, y: 274, angle: 187},
  {x: 316, y: 298, angle: 180},
  {x: 302, y: 313, angle: 200},
  {x: 273, y: 323, angle: 295},
  {x: 203, y: 332, angle: 200},
  {x: 226, y: 332, angle: 187},
  {x: 317, y: 307, angle: 180},
  {x: 221, y: 348, angle: 0},
  {x: 233, y: 343, angle: 330},
  {x: 245, y: 337, angle: 0},
  {x: 432, y: 326, angle: 300},
  {x: 416, y: 339, angle: 0},
  {x: 457, y: 319, angle: 325},
  {x: 472, y: 315, angle: 300},
  {x: 775, y: 336, angle: 330},
  {x: 848, y: 246, angle: 310},
  {x: 856, y: 231, angle: 0},
  {x: 577, y:  94, angle: 330},
  {x: 585, y:  83, angle: 0},
  {x: 593, y:  77, angle: 310},
  {x:  73, y: 229, angle: 330},
  {x:  80, y: 250, angle: 310},
  {x:  80, y: 294, angle: 340},
  {x: 522, y: 630, angle: 210},
  {x: 547, y: 640, angle: 230},
  {x: 575, y: 650, angle: 256},
  {x: 520, y: 599, angle: 190},
  {x: 521, y: 599, angle: 255},
  {x: 522, y: 596, angle: 300},
  {x: 542, y: 577, angle: 250},
  {x: 549, y: 575, angle: 182},
  {x: 553, y: 572, angle: 280},
  {x: 562, y: 569, angle: 310},
  {x: 570, y: 566, angle: 210},
  {x: 576, y: 565, angle: 220},
  {x: 586, y: 562, angle: 272},
  {x: 594, y: 561, angle: 150},
  {x: 602, y: 560, angle: 250},
  {x: 611, y: 558, angle: 305},
  {x: 613, y: 558, angle: 252},
  {x: 617, y: 556, angle: 304},
  {x: 693, y: 312, angle: 258},
  {x: 380, y: 200, angle: 309},
  {x: 153, y:  15, angle: 250},
  {x: 150, y:  15, angle: 300},
];
