import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

// e.g. fetch your container/session ID however you need
async function getDockerId() {
  const response = await fetch('/api/sessions', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data.output;
}

const InteractiveTerminal = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const socketRef = useRef(null);
  const [connecting, setConnecting] = useState(false);
  const addonLoaded = useRef(false);
  
  // internal helper to send input to container and echo in UI
  const sendInput = (data = '') => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(data);
      // termRef.current.write(data);
    } else {
      console.warn('Terminal socket not open – cannot send:', data);
    }
  };

  // expose sendInput() to parent via ref
  useImperativeHandle(ref, () => ({
    sendInput
  }));

  const connectTerminal = async () => {
    try {
      setConnecting(true);
      // close old socket if exists
      if (socketRef.current) {
        socketRef.current.close();
      }

      const dockerId = await getDockerId();
      const { AttachAddon } = await import('@xterm/addon-attach');
      const url = `ws://138.28.162.111:2375/containers/${dockerId}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`;
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.addEventListener('open', () => {
        const addon = new AttachAddon(socket);
        if (!addonLoaded.current) {
          termRef.current.loadAddon(new AttachAddon(socket));
          addonLoaded.current = true;
        }
        // send initial shell launch
        sendInput('bash\n');

        console.log('Terminal connected to', url);
        setConnecting(false);
      });

      socket.addEventListener('error', err => {
        console.error('WebSocket error:', err);
        setConnecting(false);
      });

      socket.addEventListener('close', evt => {
        console.warn('WebSocket closed:', evt);
      });
    } catch (err) {
      console.error('Failed to connect terminal:', err);
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    termRef.current = new Terminal();
    termRef.current.open(containerRef.current);

    // initial connection
    connectTerminal();

    return () => {
      socketRef.current?.close();
      termRef.current?.dispose();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 8 }}>
        <button
          onClick={connectTerminal}
          disabled={connecting}
          style={{ padding: '6px 12px', fontSize: 14 }}
        >
        
        </button>
      </div>
      <div
        ref={containerRef}
        style={{
          flexGrow: 1,
          width: '100%',
          height: 200,
          border: '1px solid #333'
        }}
      />
    </div>
  );
});

export default InteractiveTerminal;
