// One shared RAF scheduler; subscribers return false when settled/offscreen.
type Tick = (dt: number, now: number) => boolean;
const tasks = new Set<Tick>();
let frame = 0, previous = 0;
function run(now: number) {
  const dt = previous ? Math.min((now - previous) / (1000 / 60), 2) : 1;
  previous = now; frame = 0;
  for (const task of tasks) if (!task(dt, now)) tasks.delete(task);
  if (tasks.size) frame = requestAnimationFrame(run); else previous = 0;
}
export function wake(task: Tick) { tasks.add(task); if (!frame) frame = requestAnimationFrame(run); }
export function stop(task: Tick) { tasks.delete(task); if (!tasks.size) { cancelAnimationFrame(frame); frame = 0; previous = 0; } }
export const damp = (current: number, target: number, smoothing: number, dt: number) => current + (target-current) * (1-Math.pow(1-smoothing, dt));
export const clamp01 = (value: number) => Math.max(0,Math.min(1,value));
