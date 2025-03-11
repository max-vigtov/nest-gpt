import * as path from "node:path";
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase, translateUseCase, textToAudioUseCase, audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase } from './use-cases';
import OpenAI from 'openai';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { ImageGenerationDto, ImageVariationDto } from './dtos';

@Injectable()
export class GptService {
	private openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	async orthographyCheck( orthographyDto: OrthographyDto ) {
		return await orthographyCheckUseCase( this.openai, {
			prompt: orthographyDto.prompt
		});
	}

	async prosConsDicusser({ prompt }: ProsConsDiscusserDto ) {
		return await prosConsDicusserUseCase(this.openai, { prompt });
	}

	async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto ) {
		return await prosConsDicusserStreamUseCase(this.openai, { prompt });
	}

	async translateText({ prompt, lang }: TranslateDto ) {
		return await translateUseCase(this.openai, { prompt, lang });
	}

	async textToAudio({ prompt, voice }: TextToAudioDto ) {
		return await textToAudioUseCase(this.openai, { prompt, voice });
	}

	async textToAudioGetter( fileId: string ) {

		const filePath = path.resolve( __dirname, '../../generated/audios/', `${fileId}.mp3` )
		const wasFound = fs.existsSync( filePath )

		if( !wasFound ) throw new NotFoundException( `File ${ fileId } not found`)

		return filePath;

	}

	async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {

		const { prompt } = audioToTextDto;
		return await audioToTextUseCase( this.openai, { audioFile, prompt });
	}
	
	async imageGeneration( imageGenerationDto: ImageGenerationDto ) {
		return await imageGenerationUseCase( this.openai, { ...imageGenerationDto });
	
	}

	async getGeneratedImage( fileId: string ) {

		const filePath = path.resolve( __dirname, '../../generated/images/', `${fileId}` )
		const wasFound = fs.existsSync( filePath )

		if( !wasFound ) throw new NotFoundException( `File ${ fileId } not found`)

		return filePath;
	}

	async imageVariation( { baseImage }: ImageVariationDto ) {
		return await imageVariationUseCase( this.openai, { baseImage })
	}	

}
