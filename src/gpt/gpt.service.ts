import * as path from "node:path";
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase, translateUseCase, textToAudioUseCase } from './use-cases';
import OpenAI from 'openai';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

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
}
