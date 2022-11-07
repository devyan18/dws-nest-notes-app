import { IsArray, IsNotEmpty } from 'class-validator';

export class ReorderNotesDto {
  @IsArray()
  @IsNotEmpty()
  notes: string[];
}
