import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographycheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck( orthographyDto );
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto
  ) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusseStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK);
    
    for await( const chunk of stream ) {
      const piece = chunk.choices[0].delta.content || '';
      res.write( piece );
    }
    res.end();
  }

  @Post('translate')
  translate(
    @Body() translateDto: TranslateDto
  ) {
    return this.gptService.translateText(translateDto);
  }

}
