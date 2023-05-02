import {
  Get,
  Put,
  Body,
  Controller,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommonDescription } from 'src/common/constants/descriptions.constants';
import { ErrorResponse } from 'src/common/dto/response.dto';

import { EditUserDto } from './dto/edit-user.dto';
import UserRespondDto from './dto/user-response.dto';
import UsersResponseDto from './dto/users-response.dto';
import { UsersSummary } from './users.constants';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.GET_ALL })
  @ApiOkResponse({
    description: CommonDescription.GET_ITEM_SUCCESS,
    type: UserRespondDto,
  })
  @ApiBadRequestResponse({
    description: CommonDescription.BAD_REQUEST,
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({
    description: CommonDescription.UNAUTHORIZED,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async get(): Promise<UsersResponseDto> {
    return this.usersService.get();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.GET_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({
    description: CommonDescription.GET_ITEM_SUCCESS,
    type: UserRespondDto,
  })
  @ApiBadRequestResponse({
    description: CommonDescription.BAD_REQUEST,
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({
    description: CommonDescription.UNAUTHORIZED,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async getById(@Param('id') id: string): Promise<UserRespondDto> {
    return this.usersService.getById(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.UPDATE_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: EditUserDto })
  @ApiOkResponse({
    description: CommonDescription.UPDATE_ITEM_SUCESS,
    type: UserRespondDto,
  })
  @ApiBadRequestResponse({
    description: CommonDescription.BAD_REQUEST,
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({
    description: CommonDescription.UNAUTHORIZED,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() editUserDto: EditUserDto,
  ): Promise<UserRespondDto> {
    return this.usersService.update(id, editUserDto);
  }
}
