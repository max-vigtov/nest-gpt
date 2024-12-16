import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';

@Injectable()
export class GptService {
	async orthographyCheck( orthographyDto: OrthographyDto ) {
		return await orthographyCheckUseCase({
			propmt: orthographyDto.prompt
		});
	}
}
