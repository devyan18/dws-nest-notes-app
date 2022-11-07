import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { ReorderNotesDto } from './dto/reorder-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    const sort = await this.noteModel.count({ user: userId });

    const note = await this.noteModel.create({
      ...createNoteDto,
      user: userId,
      sort,
    });

    return note;
  }

  async findAll(userId: string) {
    const notes = await this.noteModel
      .find({ user: userId })
      .sort({ sort: 1 })
      .exec();
    return notes;
  }

  async findOne(noteId: string, userId: string) {
    const note = await this.noteModel
      .findOne({ _id: noteId, user: userId })
      .exec();
    return note;
  }

  async update(noteId: string, updateNoteDto: UpdateNoteDto, userId: string) {
    const note = await this.noteModel.findOneAndUpdate(
      { _id: noteId, user: userId },
      updateNoteDto,
      { new: true },
    );

    return note;
  }

  async remove(noteId: string, userId: string) {
    const note = await this.noteModel.findOneAndDelete({
      _id: noteId,
      user: userId,
    });

    await this.resortNotes(userId);

    return note;
  }

  async sortNotes(reorderNotes: ReorderNotesDto, userId: string) {
    for (const noteId of reorderNotes.notes) {
      await this.noteModel.findOneAndUpdate(
        { _id: noteId, user: userId },
        { sort: reorderNotes.notes.indexOf(noteId) },
        { new: true },
      );
    }

    return await this.findAll(userId);
  }

  async resortNotes(userId: string) {
    const notes = await this.noteModel
      .find({ user: userId })
      .sort({ sort: 1 })
      .exec();

    for (const note of notes) {
      await this.noteModel.findOneAndUpdate(
        { _id: note._id, user: userId },
        { sort: notes.indexOf(note) },
        { new: true },
      );
    }
    return await this.findAll(userId);
  }

  async removeAll(userId: string) {
    await this.noteModel.deleteMany({
      user: userId,
    });
  }
}
