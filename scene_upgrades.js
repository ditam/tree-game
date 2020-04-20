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
				name: 'Chlorophyll Reabsorption',
				icon: 'icon-leaves',
				description: 'Before dropping leaves, reabsorb their chrolophyll cells to regain resources.',
				costs: [100, 100, 50],
				bought: false,
			}
		]
	},
	'trunk': {
		description: 'The trunk provides support and height to the branches. The undifferentiated ' +
									'<span class="resource stem">meristematic cells</span> are the basic building blocks of ' +
									'all other organs and tissues of the plant.',
		items: [
			{
				id: 'up_t0',
				name: 'Lignified Cell Walls',
				icon: 'icon-cells',
				description: 'A fibrous, strengthened vascular body provides structure and improved nutrient storage.',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_t1',
				name: 'Protective Terpenes',
				icon: 'icon-biohazard',
				description: 'Terpenes are toxic to pathogens, protecting the heartwood from bacteria and fungi.',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_t2',
				name: 'Compartmentalization of Decay',
				icon: 'icon-wall',
				description: 'Tissue cells form walls around wounds, preventing any damage from spreading.',
				costs: [50, 100, 200],
				bought: false,
			}
		]
	},
	'roots': {
		description: 'The roots anchor the tree to the ground, and take up nutrients and ' +
								 '<span class="resource water">water</span> from the soil.',
		items: [
			{
				id: 'up_r0',
				name: 'Mutualistic Aerobes',
				icon: 'icon-bacteria',
				description: 'Aerobic organisms populate the root microbiome, supplying nutrients and improving soil quality.',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_r1',
				name: 'Mychorrizal Partnership',
				icon: 'icon-root',
				description: 'Symbiotic fungi intertwine the roots, improving absorption of nutrients in exchange for ' +
				             '<span class="resource carb">carbohydrates.</span>',
				costs: [50, 100, 200],
				bought: false,
			},
			{
				id: 'up_r2',
				name: 'Root Name 2',
				icon: 'icon-bug',
				description: 'Root Desc 2',
				costs: [50, 100, 200],
				bought: false,
			}
		]
	},
};
