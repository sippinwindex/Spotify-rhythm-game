import { hitNote } from '@/lib/gameLogic';

describe('hitNote', () => {
  it('increases score when note is hit in tolerance zone', () => {
    const notes = [{ id: 1, lane: 0, time: 0, y: 450 }];
    const setNotes = jest.fn();
    const setScore = jest.fn();
    hitNote(0, notes, setNotes, setScore);
    expect(setScore).toHaveBeenCalledWith(expect.any(Function));
    expect(setNotes).toHaveBeenCalledWith([]);
  });
});
