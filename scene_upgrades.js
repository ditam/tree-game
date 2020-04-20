game.upgrades = {
	'branches': {
		description: 'Branches grow and hold leaves. The leaves carry out photosynthesis, turning sunlight and CO2 into ' +
								 '<span class="resource carb">carbohydrates</span>, using up ' +
								 '<span class="resource water">water</span> reserves in the process.',
		items: [
			{
				id: 'up_b0',
				name: 'Apical Dominance',
				icon: 'icon-branch',
				description: 'Designate the main trunk, to gain height and access to more light.',
				costs: [100, 100, 50],
				bought: true, // FIXME debug only
			},
			{
				id: 'up_b1',
				name: 'Stomata Guards',
				icon: 'icon-light',
				description: 'Use guard cells to open and close the stomata during the day, improving energy efficiency.',
				costs: [100, 100, 50],
				bought: false,
			},
			{
				id: 'up_b2',
				name: 'Chlorophyll Reabsorbption',
				icon: 'icon-leaves',
				description: 'Use guard cells to open and close the stomata during the day, improving energy efficiency.',
				costs: [100, 100, 50],
				bought: false,
			}
		]
	},
	'trunk': {
		description: 'This is important too...',
		items: [
			{
				id: 'up_t0',
				name: 'Trunk Name 0',
				icon: 'icon-branch',
				description: 'Trunk Desc 0',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_t1',
				name: 'Trunk Name 1',
				icon: 'icon-light',
				description: 'Trunk Desc 1',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_t2',
				name: 'Trunk Name 2',
				icon: 'icon-leaves',
				description: 'Trunk Desc 2',
				costs: [50, 100, 200],
				bought: false,
			}
		]
	},
	'roots': {
		description: 'This is important too...',
		items: [
			{
				id: 'up_r0',
				name: 'Root Name 0',
				icon: 'icon-branch',
				description: 'Root Desc 0',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_r1',
				name: 'Root Name 1',
				icon: 'icon-light',
				description: 'Root Desc 1',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_r2',
				name: 'Root Name 2',
				icon: 'icon-leaves',
				description: 'Root Desc 2',
				costs: [50, 100, 200],
				bought: false,
			}
		]
	},
};
