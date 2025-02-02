export default function createWorker() {
  return new Worker(new URL("./upload.ts", import.meta.url), {
    type: "module",
  });
}
