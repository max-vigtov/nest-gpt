import { Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographycheck() {
    return this.gptService.orthographyCheck();
  }
}
