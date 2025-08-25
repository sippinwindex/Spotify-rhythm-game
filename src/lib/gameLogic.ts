interface Note {
  id: number;
  lane: number;
  time: number;
  y: number;
}

export const startGame = (
  notes: Note[],
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const updatedNotes = notes.filter((note) => note.y < canvas.height + 50);

    updatedNotes.forEach((note) => {
      note.y += 2; // Adjust speed as needed
      ctx.fillStyle = 'blue';
      ctx.fillRect(
        note.lane * (canvas.width / 7),
        note.y,
        canvas.width / 7,
        20
      );
    });

    setNotes(updatedNotes);

    if (updatedNotes.length > 0) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export const hitNote = (
  lane: number,
  notes: Note[],
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>,
  setScore: React.Dispatch<React.SetStateAction<number>>
) => {
  const hitZone = 450; // Adjust based on canvas height
  const tolerance = 50;

  const hitNotes = notes.filter(
    (note) =>
      note.lane === lane &&
      note.y >= hitZone - tolerance &&
      note.y <= hitZone + tolerance
  );

  if (hitNotes.length > 0) {
    setScore((prev) => prev + 100);
    setNotes(notes.filter((note) => !hitNotes.includes(note)));
  }
};
