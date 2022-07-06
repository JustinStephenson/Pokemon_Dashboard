const METER_TO_INCHES_CONVERSION = 39.3701;
const KG_TO_LBS_CONVERSION = 2.20462;

// add one decimal to number, exp: 452 = 45.2
export const numToDec = (num: number, decNum: number): string => {
	let result = (num / (10 * decNum)).toFixed(decNum);
	return result;
};

// change m to feet with ' and '' units
export const mToFeet = (num: number, decNum: number): string => {
	const result = +(num * METER_TO_INCHES_CONVERSION).toFixed(decNum);
	const feet = Math.floor(result / 12);
	const inches = Math.round(result % 12);
	return '' + feet + "'" + inches + "''";
};

// change kilograms to pounds
export const kgToLbs = (kg: number, decNum: number): string => {
	return (kg * KG_TO_LBS_CONVERSION).toFixed(decNum);
};
