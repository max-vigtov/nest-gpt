import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudio: TextToAudioDto,
    @Res() res: Response
  ) {
      const filePath = await this.gptService.textToAudio(textToAudio);

      res.setHeader('Content-Type', 'audio/mp3')
      res.status( HttpStatus.OK )
      res.sendFile( filePath );
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string
  ) {
      const filePath = await this.gptService.textToAudioGetter(fileId);

      res.setHeader('Content-Type', 'audio/mp3')
      res.status( HttpStatus.OK )
      res.sendFile( filePath );
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Valida si el archivo es un audio antes de guardar
        if (!file.mimetype.startsWith('audio/')) {
          return callback(
            new BadRequestException('El archivo no es un audio válido'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async audioToText(    
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File us bigger than 5 mb'}),
          new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })
    ) file: Express.Multer.File,
    @Body('prompt') audioToTextDto: AudioToTextDto,
  ) {
    console.log({ audioToTextDto });
    
      return this.gptService.audioToText(file, audioToTextDto);
  }
}
