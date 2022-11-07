import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReorderNotesDto } from './dto/reorder-notes.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const user = req.user;
    return this.notesService.create(createNoteDto, user._id);
  }

  @Get()
  findAll(@Request() req) {
    const user = req.user;
    return this.notesService.findAll(user._id);
  }

  @Get(':noteId')
  findOne(@Param('noteId') noteId: string, @Request() req) {
    const user = req.user;
    return this.notesService.findOne(noteId, user._id);
  }

  @Put(':noteId')
  update(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.notesService.update(noteId, updateNoteDto, user._id);
  }

  @Patch()
  sortNotes(@Body() reorderNotesDto: ReorderNotesDto, @Request() req) {
    const user = req.user;
    return this.notesService.sortNotes(reorderNotesDto, user._id);
  }

  @Delete(':noteId')
  remove(@Param('noteId') noteId: string, @Request() req) {
    const user = req.user;
    return this.notesService.remove(noteId, user._id);
  }

  @Delete()
  removeAll(@Request() req) {
    const user = req.user;
    return this.notesService.removeAll(user._id);
  }
}
