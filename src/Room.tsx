import faker from "faker";
import debounce from "lodash/debounce";
import React, { ChangeEvent, useState } from "react";
import Client from "./Client";

interface User {
  id: string;
  name: string;
}

interface RoomProps {
  slug: string;
  removeRoom: () => void;
}

const createUser = (): User => ({
  id: faker.random.uuid(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
});

const Room: React.FC<RoomProps> = ({ slug, removeRoom }) => {
  const [users, setUsers] = useState<User[]>([createUser(), createUser()]);
  const [roomSlug, setRoomSlug] = useState<string>(slug);
  const [isRemounted, setRemountState] = useState(false);

  const remount = debounce(() => {
    setRemountState(true);
    setTimeout(setRemountState, 50, false);
  }, 300);

  const changeSlug = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomSlug(e.target.value);
    remount();
  };

  const addUser = () => setUsers((users) => users.concat(createUser()));

  const removeUser = (userId: string) =>
    setUsers((users) => users.filter((u: User) => u.id !== userId));

  return (
    <div>
      <h3>
        <p>Document slug:</p>
        <input type="text" value={roomSlug} onChange={changeSlug} />
        <button type="button" onClick={addUser}>
          Add random user
        </button>
        <button type="button" onClick={removeRoom}>
          Remove Room
        </button>
      </h3>
      <div>
        {users.map((user: User) =>
          isRemounted ? null : (
            <Client {...user} slug={roomSlug} key={user.id} removeUser={removeUser} />
          )
        )}
      </div>
    </div>
  );
};

export default Room;
