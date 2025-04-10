import OpenAI from "openai"
import * as fs from "fs";
import { downloadImageAsPng } from '../../helpers/download-images-as-png';

interface Options {
	baseImage: string
}

export const imageVariationUseCase = async ( openai: OpenAI, { baseImage }: Options ) => {

	const pngImagePath = await downloadImageAsPng( baseImage, true );

	console.log( pngImagePath );
	
	const response = await openai.images.createVariation({
		model: 'dall-e-2',
		image: fs.createReadStream( pngImagePath ),
		n: 1,
		size: '1024x1024',
		response_format: 'url'
	})

	const fileName = await downloadImageAsPng( response.data[0].url );
	const url = `${ process.env.SERVER_URL }/gpt/image-generation/${ fileName }`
  

	return {
	  url: url, 
	  openAIUrl: response.data[0].url,
	  revised_prompt: response.data[0].revised_prompt,
	}
  };