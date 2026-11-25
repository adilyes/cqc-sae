import { setTimeout as sleep } from 'node:timers/promises';
import { POLL_INTERVAL_MS } from '../data/scenario.data.js';

export async function pollUntil(read, { isDone, timeoutMs, intervalMs = POLL_INTERVAL_MS }) {
  const deadline = Date.now() + timeoutMs;
  let value = await read();
  while (!isDone(value) && Date.now() < deadline) {
    await sleep(intervalMs);
    value = await read();
  }
  return { done: isDone(value), value };
}