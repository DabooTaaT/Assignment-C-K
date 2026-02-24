import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextDecoder, TextEncoder } from "util";
import { ReadableStream, TransformStream, WritableStream } from "stream/web";
import { BroadcastChannel } from "worker_threads";

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}

if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream as unknown as typeof global.ReadableStream;
}

if (!global.WritableStream) {
  global.WritableStream = WritableStream as unknown as typeof global.WritableStream;
}

if (!global.TransformStream) {
  global.TransformStream = TransformStream as unknown as typeof global.TransformStream;
}

if (!global.BroadcastChannel) {
  global.BroadcastChannel = BroadcastChannel as unknown as typeof global.BroadcastChannel;
}

import { server } from "@/core/data/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
