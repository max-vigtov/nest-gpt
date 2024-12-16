
interface Options {
	propmt: string;
}

export const orthographyCheckUseCase = async ( options: Options ) => {

	const { propmt } = options;

	return {
		propmt: propmt
	}
}