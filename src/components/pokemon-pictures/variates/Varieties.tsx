import { useEffect, useState } from 'react';
import { getApiResponseFromUrl } from 'util/apiCall';
import { getPicture } from 'util/pictureRetrival';
import './Varieties.scss';

export type VarietiesType = [
	{
		is_default: boolean;
		pokemon: {
			name: string;
			url: string;
		};
	}
];

type varObj = {
	name: string;
	imgUrl: string;
};

export type VarietiesProps = {
	varietyDetails: VarietiesType | null;
};

export const Varieties = (props: VarietiesProps) => {
	const [varieties, setVarieties] = useState<JSX.Element[]>([]);

	useEffect(() => {
		setup().then((elements) => {
			setVarieties(elements);
		});
	}, []);

	const setup = async (): Promise<JSX.Element[]> => {
		const images: JSX.Element[] = [];
		let objects: varObj[] = [];
		let keyValue = 0;
		await getImagesAndNames().then((obj) => {
			objects = obj;
		});
		if (props.varietyDetails) {
			for (const obj of objects) {
				await getPicture(obj.imgUrl).then((imgUrl) => {
					if (obj.imgUrl) {
						images.push(
							<div key={keyValue++} className="varieties">
								<img src={imgUrl} alt="variety" />
								<p>{obj.name}</p>
							</div>
						);
					}
				});
			}
		}
		return images;
	};

	const getImagesAndNames = async (): Promise<varObj[]> => {
		const objects: varObj[] = [];
		if (props.varietyDetails) {
			// skip first default image
			for (let i = 1; i < props.varietyDetails.length; i++) {
				let details = props.varietyDetails[i];
				await getApiResponseFromUrl(details.pokemon.url).then(
					(pokemon: any) => {
						objects.push({
							name: details.pokemon.name,
							imgUrl:
								pokemon.sprites.other['official-artwork']['front_default'],
						});
					}
				);
			}
		}
		return objects;
	};

	return <div className="var-container">{varieties}</div>;
};
