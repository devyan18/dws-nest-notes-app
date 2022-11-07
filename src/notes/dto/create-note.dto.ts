import { IsNotEmpty } from 'class-validator';
import { Note } from '../entities/note.entity';

export class CreateNoteDto extends Note {
  @IsNotEmpty()
  content: string;
}
