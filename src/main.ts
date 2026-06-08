type SeatState = 0 | 1;
type RoomMatrix = SeatState[][];

const AVAILABLE: SeatState = 0;
const OCCUPIED: SeatState = 1;

function initializeRoom(rows = 8, columns = 10): RoomMatrix {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => AVAILABLE),
  );
}

function seatToLabel(seat: SeatState): "L" | "X" {
  return seat === OCCUPIED ? "X" : "L";
}

function printRoom(room: RoomMatrix): void {
  const totalColumns = room[0]?.length ?? 0;
  const header = ["  ", ...Array.from({ length: totalColumns }, (_, i) => String(i + 1))]
    .map((value) => value.padStart(2, " "))
    .join(" ");

  console.log(header);

  room.forEach((row, rowIndex) => {
    const rowLabel = String(rowIndex + 1).padStart(2, " ");
    const rowValues = row.map((seat) => seatToLabel(seat).padStart(2, " ")).join(" ");
    console.log(`${rowLabel} ${rowValues}`);
  });
}

const room = initializeRoom();
printRoom(room);

export { initializeRoom, printRoom, AVAILABLE, OCCUPIED };
