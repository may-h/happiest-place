// import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
// import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
// import { UserService } from './user.service';
// import {
//   ApiBadRequestResponse,
//   ApiBody,
//   ApiCreatedResponse,
//   ApiForbiddenResponse,
//   ApiNotFoundResponse,
//   ApiOkResponse,
//   ApiOperation,
//   ApiParam,
//   ApiResponse,
//   ApiTags,
//   ApiUnauthorizedResponse,
//   getSchemaPath,
// } from '@nestjs/swagger';
// import { User } from './entities/User.entity';
// import { HttpError4xxDto } from '../emotion/dto/apiResponses.dto';
//
// @Controller('user')
// @ApiTags('auth')
// @ApiBadRequestResponse({ description: 'Bad Request', type: HttpError4xxDto })
// export class UserController {
//   private logger = new Logger(UserController.name);
//   constructor(private userService: UserService) {}
//
//   @Post('signup')
//   @ApiOperation({
//     summary: 'Signs up a user to the Happiest-place service',
//     description: 'Creates a user account for the given user details',
//   })
//   @ApiBody({ type: CreateUserDto })
//   @ApiResponse({ status: 409, description: 'User already exists', type: HttpError4xxDto })
//   @ApiCreatedResponse({ description: 'The user has been successfully created.', type: User })
//   signup(@Body() userData: CreateUserDto) {
//     this.logger.debug(JSON.stringify(userData));
//     return this.userService.signup(userData);
//   }
//
//   @Get()
//   @ApiOperation({
//     summary: 'Get all user list',
//     description: 'Get all user accounts',
//   })
//   @ApiOkResponse({
//     schema: {
//       allOf: [
//         {
//           properties: {
//             results: {
//               type: 'array',
//               items: { $ref: getSchemaPath(CreateUserDto) },
//             },
//           },
//         },
//       ],
//     },
//   })
//   @ApiUnauthorizedResponse({ description: 'Unauthorized', type: HttpError4xxDto })
//   getUsers() {
//     return this.userService.getAllUsers();
//   }
//
//   @Put()
//   @ApiOperation({
//     summary: 'Update user',
//     description: 'Update a user detail',
//   })
//   @ApiBody({ type: UpdateUserDto })
//   @ApiOkResponse({ schema: { $ref: getSchemaPath(CreateUserDto) } })
//   @ApiNotFoundResponse({ description: 'Not Found', type: HttpError4xxDto })
//   updateUser(@Body() updateUserDto: UpdateUserDto) {}
//
//   @Get(':id')
//   @ApiOperation({
//     summary: 'Find user by ID',
//     description: 'Returns a single user',
//     operationId: 'getUserById',
//   })
//   @ApiOkResponse({ schema: { $ref: getSchemaPath(User) } })
//   @ApiNotFoundResponse({ description: 'Not Found', type: HttpError4xxDto })
//   getUserById(@Param('id') id: number) {
//     return this.userService.findById(id);
//   }
//
//   @Delete(':id')
//   @ApiParam({ name: 'id', schema: { type: 'integer' } })
//   @ApiOperation({ summary: 'Delete user by ID', description: 'Delete a user by ID' })
//   @ApiResponse({ status: 204, description: 'Remove Succeeded' })
//   @ApiNotFoundResponse({ description: 'Not Found', type: HttpError4xxDto })
//   deleteUser(@Param('id') id: number) {
//     return this.userService.deleteUser(id); // 탈퇴
//   }
// }
