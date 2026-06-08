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

async function runReservationFlow(): Promise<void> {
  let room = initializeRoom();
  printRoom(room);

  // @ts-expect-error El proyecto no incluye tipos de Node por decisión del ejercicio.
  const { createInterface } = await import("node:readline/promises");
  // @ts-expect-error El proyecto no incluye tipos de Node por decisión del ejercicio.
  const { stdin: input, stdout: output } = await import("node:process");
  const rl = createInterface({ input, output });

  try {
    while (true) {
      console.log("\nReserve seat (R) | Quit (Q):");
      const action = (await rl.question("> ")).trim().toUpperCase();

      if (action === "Q") {
        console.log("Saliendo...");
        break;
      }

      if (action !== "R") {
        console.log("Accion no reconocida. Usa R para reservar o Q para salir.");
        continue;
      }

      const row = Number.parseInt((await rl.question("Fila: ")).trim(), 10);
      const column = Number.parseInt((await rl.question("Columna: ")).trim(), 10);
      room = reserveSingleSeat(room, row, column);

      console.log("\nSala actualizada:");
      printRoom(room);
    }
  } finally {
    rl.close();
  }
}

await runReservationFlow();

export { initializeRoom, printRoom, reserveSingleSeat, AVAILABLE, OCCUPIED };
