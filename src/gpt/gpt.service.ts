import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase } from './use-cases';
import OpenAI from 'openai';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Injectable()
export class GptService {

	private openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	async orthographyCheck( orthographyDto: OrthographyDto ) {
		return await orthographyCheckUseCase( this.openai, {
			propmt: orthographyDto.prompt
		});
	}

	async prosConsDicusser({ prompt }: ProsConsDiscusserDto ) {
		return await prosConsDicusserUseCase(this.openai, { prompt });
	}

	async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto ) {
		return await prosConsDicusserStreamUseCase(this.openai, { prompt });
	}
}
