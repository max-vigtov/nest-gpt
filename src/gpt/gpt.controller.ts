import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos/orthography.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographycheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck( orthographyDto );
  }
}
