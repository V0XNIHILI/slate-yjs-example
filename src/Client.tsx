import React, { useEffect, useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { WebsocketEditorOptions, withWebsocket, withYjs } from "slate-yjs";
import EditorFrame from "./EditorFrame";
import { withLinks } from "./plugins/link";

interface ClientProps {
  name: string;
  id: string;
  slug: string;
  removeUser: (id: any) => void;
}

const Client: React.FC<ClientProps> = ({ id, name, slug, removeUser }) => {
  const [value, setValue] = useState<Node[]>([]);
  const [isOnline, setOnlineState] = useState<boolean>(false);

  const editor = useMemo(() => {
    const slateEditor = withYjs(
      withLinks(withReact(withHistory(createEditor())))
    );

    const endpoint =
      process.env.NODE_ENV === "production"
        ? window.location.origin
        : "ws://192.168.2.19:9000";

    const options: WebsocketEditorOptions = {
      endpoint: endpoint,
      roomName: slug,
      onConnect: () => setOnlineState(true),
      onDisconnect: () => setOnlineState(false),
    };

    return withWebsocket(slateEditor, options);
  }, []);

  useEffect(() => {
    editor.connect();
    return editor.destroy;
  }, []);

  const toggleOnline = () => {
    const { connect, disconnect } = editor;
    isOnline ? disconnect() : connect();
  };

  return (
    <div>
      <h2>
        <p>Editor: {name}</p>
        <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
          <button type="button" onClick={toggleOnline}>
            Go {isOnline ? "offline" : "online"}
          </button>
          <button type="button" onClick={() => removeUser(id)}>
            Remove
          </button>
        </div>
      </h2>

      <EditorFrame
        editor={editor}
        value={value}
        onChange={(value: Node[]) => setValue(value)}
      />
    </div>
  );
};

export default Client;
