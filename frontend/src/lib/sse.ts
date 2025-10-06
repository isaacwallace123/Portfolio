type SSEHandlers = {
  onMessage: (data: string) => void;
  onOpen?: () => void;
  onError?: (e: Event) => void;
};

export function connectSSE(
  url: string,
  { onMessage, onOpen, onError }: SSEHandlers
) {
  const es = new EventSource(url);

  es.onopen = () => onOpen?.();
  es.onmessage = ev => onMessage(ev.data);
  es.onerror = e => onError?.(e);

  return () => es.close();
}
