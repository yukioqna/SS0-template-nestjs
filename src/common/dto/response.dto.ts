import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CommonError } from '../constants/errors.constants';
import { CommonMessage } from '../constants/messages.constants';

export class ErrorResponse {
  @ApiProperty({
    description: 'HTTP response status code.',
    examples: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.CONFLICT,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ],
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message to display.',
    examples: [CommonMessage.NOT_FOUND_BY_ID, CommonMessage.ALREADY_EXIST],
  })
  message: string;

  @ApiProperty({
    description: 'Error to display from HTTP exception.',
    examples: [CommonError.CONFLICT, CommonError.INTERNAL_SERVER_ERROR],
  })
  error: string;
}
