import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlackService } from './slack.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';

@Controller('slack')
export class SlackController {
  constructor(private readonly experimentService: SlackService) {}

  @Post()
  create(@Body() createExperimentDto: CreateExperimentDto) {
    return this.experimentService.create(createExperimentDto);
  }

  @Get()
  findAll() {
    return this.experimentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExperimentDto: UpdateExperimentDto) {
    return this.experimentService.update(+id, updateExperimentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentService.remove(+id);
  }
}
