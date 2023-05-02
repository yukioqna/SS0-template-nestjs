import { HttpException } from '@nestjs/common';

export interface ILog {
  endpoint: string;
  method: string;
  ipAddress: string;
  message?: string;
  data?: object;
  error?: HttpException;
}
