import { useEffect, useState } from 'react';
import { getApiResponseFromUrl } from 'util/apiCall';
import {
	ARTWORK_SIZE,
	getArtworkUrl,
	preloadImage,
} from 'util/pictureRetrival';
import { Spinner } from 'components/spinner/Spinner';
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
	const [varieties, setVarieties] = useState<JSX.Element[]>([
		<Spinner key={'spinner'}></Spinner>,
	]);

	useEffect(() => {
		setup().then((elements) => {
			setVarieties(elements);
		});
	}, []);

	const setup = async (): Promise<JSX.Element[]> => {
		if (!props.varietyDetails) {
			return [];
		}
		const objects: varObj[] = (await getImagesAndNames()).filter(
			(obj) => obj.imgUrl
		);
		// load every variety image at the same time, not one after another
		await Promise.all(objects.map((obj) => preloadImage(obj.imgUrl)));

		return objects.map((obj) => (
			<div key={obj.name} className="varieties">
				<img
					src={obj.imgUrl}
					alt="variety"
					width={ARTWORK_SIZE}
					height={ARTWORK_SIZE}
					decoding="async"
				/>
				<p>{obj.name}</p>
			</div>
		));
	};

	const getImagesAndNames = (): Promise<varObj[]> => {
		if (!props.varietyDetails) {
			return Promise.resolve([]);
		}
		// skip first default image; request the rest in parallel
		return Promise.all(
			props.varietyDetails.slice(1).map((details) =>
				getApiResponseFromUrl(details.pokemon.url).then(
					(pokemon: any): varObj => ({
						name: details.pokemon.name,
						imgUrl: getArtworkUrl(pokemon),
					})
				)
			)
		);
	};

	return <div className="var-container">{varieties}</div>;
};
