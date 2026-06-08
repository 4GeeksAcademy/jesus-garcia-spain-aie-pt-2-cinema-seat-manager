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

function reserveSingleSeat(room: RoomMatrix, row: number, column: number): RoomMatrix {
  const rowIndex = row - 1;
  const columnIndex = column - 1;

  if (rowIndex < 0 || rowIndex >= room.length) {
    return room;
  }

  const totalColumns = room[rowIndex]?.length ?? 0;
  if (columnIndex < 0 || columnIndex >= totalColumns) {
    return room;
  }

  if (room[rowIndex][columnIndex] === OCCUPIED) {
    return room;
  }

  return room.map((roomRow, currentRowIndex) => {
    if (currentRowIndex !== rowIndex) {
      return roomRow;
    }

    return roomRow.map((seat, currentColumnIndex) =>
      currentColumnIndex === columnIndex ? OCCUPIED : seat,
    );
  });
}

function validateReservation(
  room: RoomMatrix,
  row: number,
  column: number,
): "SUCCEEDED" | "OCCUPIED" | "INVALID" {
  const rowIndex = row - 1;
  const columnIndex = column - 1;

  if (rowIndex < 0 || rowIndex >= room.length) {
    return "INVALID";
  }

  const totalColumns = room[rowIndex]?.length ?? 0;
  if (columnIndex < 0 || columnIndex >= totalColumns) {
    return "INVALID";
  }

  return room[rowIndex][columnIndex] === OCCUPIED ? "OCCUPIED" : "SUCCEEDED";
}

function countSeats(room: RoomMatrix, state: SeatState): {available: number; occupied: number, total: number} {
  const available = room.flat().filter((seat) => seat === AVAILABLE).length;
  const occupied = room.flat().filter((seat) => seat === OCCUPIED).length;
  const total = available + occupied;
  return { available, occupied, total };
}

async function runReservationFlow(): Promise<void> {
  let room = initializeRoom();
  printRoom(room);

  // @ts-expect-error This exercise intentionally excludes Node type definitions.
  const { createInterface } = await import("node:readline/promises");
  // @ts-expect-error This exercise intentionally excludes Node type definitions.
  const { stdin: input, stdout: output } = await import("node:process");
  const rl = createInterface({ input, output });

  try {
    while (true) {
      const { available, occupied, total } = countSeats(room, AVAILABLE);
      console.log(`\n - Number of available seats: ${available}`);
      console.log(` - Number of occupied seats: ${occupied}`);
      console.log(` - Total number of seats: ${total}`);
      console.log("\nReserve seat (R) | Quit (Q):");
      const action = (await rl.question("> ")).trim().toUpperCase();

      if (action === "Q") {
        console.log("Exiting...");
        break;
      }

      if (action !== "R") {
        console.log("Unknown action. Use R to reserve or Q to quit.");
        continue;
      }

      const row = Number.parseInt((await rl.question("Row: ")).trim(), 10);
      const column = Number.parseInt((await rl.question("Column: ")).trim(), 10);

      const reservationStatus = validateReservation(room, row, column);
      if (reservationStatus === "SUCCEEDED") {
        room = reserveSingleSeat(room, row, column);
        console.log("✅ Reservation succeeded ✅");
      } else if (reservationStatus === "OCCUPIED") {
        console.log("❌ Occupied ❌ - seat is already taken.");
      } else {
        console.log("❌ Invalid seat ❌ - row or column is out of bounds.");
      }

      console.log("\nUpdated room:");
      printRoom(room);
    }
  } finally {
    rl.close();
  }
}

await runReservationFlow();

export { validateReservation, initializeRoom, printRoom, reserveSingleSeat, AVAILABLE, OCCUPIED };
