import faker from "faker";
import React, { useEffect, useState } from "react";
import Room from "./Room";

const App = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const addRoom = () => setRooms(rooms.concat(faker.lorem.slug(4)));
  const removeRoom = (room: string) => () =>
    setRooms(rooms.filter((r) => r !== room));

  useEffect(() => {
    addRoom();
  }, []);

  return (
    <div>
      <div>
        <button type="button" onClick={addRoom}>
          Add Room
        </button>
      </div>
      {rooms.map((room) => (
        <Room key={room} slug={room} removeRoom={removeRoom(room)} />
      ))}
    </div>
  );
};

export default App;