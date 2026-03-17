import { Test } from '@nestjs/testing';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';
import { DiaryEntity } from '@domain/diary/diary.entity';
import { DIARY_REPOSITORY_TOKEN } from '@domain/diary/diary.repository';
import { S3Provider } from '@providers/s3/s3.provider';

import { UpdateDiaryAudioUseCase } from '../update-diary-audio.use-case';

describe('Use Cases -> Diary -> Update Audio', () => {
  let updateDiaryAudioUseCase: UpdateDiaryAudioUseCase;

  const diary = new DiaryMock({ audioUrl: undefined });
  const updatedDiary = new DiaryMock({
    ...diary,
    audioUrl: 'https://bucket.s3.amazonaws.com/diaries/audios/new-audio.mp3'
  });

  const file = {
    buffer: Buffer.from('audio'),
    mimetype: 'audio/mpeg',
    originalname: 'audio.mp3'
  } as Express.Multer.File;

  const diaryRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  const s3ServiceMock = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateDiaryAudioUseCase,
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
        },
        {
          provide: S3Provider,
          useValue: s3ServiceMock
        }
      ]
    }).compile();

    updateDiaryAudioUseCase = module.get<UpdateDiaryAudioUseCase>(UpdateDiaryAudioUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should upload new audio and update diary (no previous audio)', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);
    s3ServiceMock.uploadFile.mockResolvedValue({ url: updatedDiary.audioUrl });
    diaryRepositoryMock.update.mockResolvedValue(updatedDiary);

    const input = { filters: { id: diary.id }, file };

    const result = await updateDiaryAudioUseCase.execute(input);

    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(s3ServiceMock.deleteFile).not.toHaveBeenCalled();
    expect(s3ServiceMock.uploadFile).toHaveBeenCalledWith(expect.any(String), file.buffer, file.mimetype);
    expect(diaryRepositoryMock.update).toHaveBeenCalledWith(input.filters, { audioUrl: updatedDiary.audioUrl });
    expect(result).toEqual(new DiaryEntity(updatedDiary));
  });

  it('should delete previous audio when exists', async () => {
    const diaryWithAudio = new DiaryMock({
      ...diary,
      audioUrl: 'https://bucket.s3.amazonaws.com/diaries/audios/old.mp3'
    });
    diaryRepositoryMock.findOne.mockResolvedValue(diaryWithAudio);
    s3ServiceMock.uploadFile.mockResolvedValue({ url: updatedDiary.audioUrl });
    diaryRepositoryMock.update.mockResolvedValue(updatedDiary);

    const input = { filters: { id: diary.id }, file };

    const result = await updateDiaryAudioUseCase.execute(input);

    expect(s3ServiceMock.deleteFile).toHaveBeenCalledWith(diaryWithAudio.audioUrl);
    expect(s3ServiceMock.uploadFile).toHaveBeenCalled();
    expect(result).toEqual(new DiaryEntity(updatedDiary));
  });

  it('should throw not found when diary does not exist', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(null);

    const input = { filters: { id: diary.id }, file };

    await expect(updateDiaryAudioUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_FOUND));
    expect(s3ServiceMock.uploadFile).not.toHaveBeenCalled();
    expect(diaryRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw not updated when repository fails to update', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);
    s3ServiceMock.uploadFile.mockResolvedValue({ url: updatedDiary.audioUrl });
    diaryRepositoryMock.update.mockResolvedValue(null);

    const input = { filters: { id: diary.id }, file };

    await expect(updateDiaryAudioUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_UPDATED));
    expect(s3ServiceMock.uploadFile).toHaveBeenCalled();
    expect(diaryRepositoryMock.update).toHaveBeenCalledWith(input.filters, { audioUrl: updatedDiary.audioUrl });
  });
});
