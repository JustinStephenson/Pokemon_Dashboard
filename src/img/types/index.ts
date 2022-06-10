import Bug from './type_bug.png';
import Dark from './type_dark.png';
import Dragon from './type_dragon.png';
import Electric from './type_electric.png';
import Fairy from './type_fairy.png';
import Fighting from './type_fighting.png';
import Fire from './type_fire.png';
import Flying from './type_flying.png';
import Ghost from './type_ghost.png';
import Grass from './type_grass.png';
import Ground from './type_ground.png';
import Ice from './type_ice.png';
import Normal from './type_normal.png';
import Poison from './type_poison.png';
import Psychic from './type_psychic.png';
import Rock from './type_rock.png';
import Steel from './type_steel.png';
import Water from './type_water.png';

export type ImgImport = typeof Normal;

type PokeType = {
	name: string;
	imgLoc: ImgImport;
};

const mapping: { [index: string]: PokeType } = {
	bug: { name: 'bug', imgLoc: Bug },
	dark: { name: 'dark', imgLoc: Dark },
	dragon: { name: 'dragon', imgLoc: Dragon },
	electric: { name: 'electric', imgLoc: Electric },
	fairy: { name: 'fairy', imgLoc: Fairy },
	fighting: { name: 'fighting', imgLoc: Fighting },
	fire: { name: 'fire', imgLoc: Fire },
	flying: { name: 'flying', imgLoc: Flying },
	ghost: { name: 'ghost', imgLoc: Ghost },
	grass: { name: 'grass', imgLoc: Grass },
	ground: { name: 'ground', imgLoc: Ground },
	ice: { name: 'ice', imgLoc: Ice },
	normal: { name: 'normal', imgLoc: Normal },
	poison: { name: 'poison', imgLoc: Poison },
	psychic: { name: 'psychic', imgLoc: Psychic },
	rock: { name: 'rock', imgLoc: Rock },
	steel: { name: 'steel', imgLoc: Steel },
	water: { name: 'water', imgLoc: Water },
};

export const getImgImportFromName = (name: string): ImgImport => {
	let result: ImgImport = null;
	Object.keys(mapping).forEach((key) => {
		if (mapping[key].name === name) {
			result = mapping[key].imgLoc;
		}
	});
	return result;
};
