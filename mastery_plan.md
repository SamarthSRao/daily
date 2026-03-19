# 10-Month Full-Stack + Backend Mastery Plan
### Daily Breakdown: Technologies, Concepts & Purpose

This document explains every single day of the plan in plain language. For each day you will see exactly: what you are building, which technologies you are using, which concepts you are learning, and most importantly **why** each concept matters in real production systems.

---

## How to Read Each Day

- 🛠 **Technologies** — the tools and languages you touch that day
- 📖 **Concepts** — the ideas you must understand deeply, not just use
- 🎯 **You Build** — the actual code artifact that proves understanding
- 🔗 **Why It Matters** — how the concept connects to real production systems

---

## The Daily Schedule (Every Weekday)

| Block | Duration | Activity |
|-------|----------|----------|
| **Morning** | 2 hours | Learn the concept. Run code. Break it. Read the source. |
| **Evening** | 2 hours | Build the named feature. Must use 3+ technologies together. |
| **DSA** | 30 min | 1 algorithm problem. Always connects to what you just built. |
| **Saturday** | 5 hours | Weekend capstone: wire the week into the flagship project. Deploy. Benchmark. |
| **Sunday** | 3 hours | Document: README, ADR, benchmark numbers, LinkedIn post. |

---

---

# MONTH 1 — JavaScript Engine Deep

> No HTML. No CSS. No frameworks. One full month with the JavaScript engine itself. You will understand closures because you build a `memoize` function. You will understand the event loop because you predict the output of 20 execution-order puzzles. You will understand async because you reimplement `Promise.all` from scratch. Every concept is proved with a test.

---

## Week 1 — The JavaScript Engine: Types, Scope, Closures, Prototypes, `this`

---

### Monday — Week 1 · Dev Setup + HTTP from Scratch + JavaScript Types & Coercion

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22 LTS, VS Code, pnpm workspaces, `curl`, `dig` (DNS tool) |
| 📖 **Concepts** | JavaScript primitive types, type coercion, `===` vs `==`, HTTP request/response cycle, DNS resolution |
| 🎯 **You Build** | FleetPulse raw GPS receiver — a plain Node.js HTTP server with no framework |
| 🔗 **Why It Matters** | Express, Fastify, and every Node.js framework is built on top of what you write today |

**Morning — JavaScript Types and How HTTP Works**

Before writing any real application, you need to understand what JavaScript actually does with data. JavaScript has two categories of values:

- **Primitive types** — `string`, `number`, `bigint`, `boolean`, `null`, `undefined`, `symbol` — stored directly by value. When you assign one variable to another, you get a copy.
- **Reference types** — objects, arrays, functions — stored as a pointer to memory. Two variables can point at the same object.

The `===` vs `==` difference is critical:

- `===` (strict equality) — checks value AND type. `"5" === 5` is `false`. This is almost always what you want.
- `==` (loose equality) — performs type coercion first. `"5" == 5` is `true`. This leads to bugs when GPS coordinates arrive as strings from JSON.

You also learn HTTP from first principles using `curl -v`. This shows you the exact bytes sent and received: the TLS handshake, redirect chain, request headers, response body. You use `dig +trace` to follow DNS resolution from root servers down to the final IP address. Understanding this means you can debug production networking issues — not just copy/paste code.

**Evening — Build the FleetPulse GPS Receiver**

You build a raw HTTP server using Node.js built-in `http` module only — no Express, no libraries. This server:

- Listens for incoming GPS pings from drivers
- Reads the request body in chunks (this is streaming — data arrives in pieces, not all at once)
- Parses the JSON body and logs the driver ID, latitude, and the `typeof` each value
- Responds with a 200 OK or a 400 error if the JSON is invalid

Why build it without Express? Because Express is just a prettier wrapper around exactly this. When Express breaks in production you need to know what is underneath it.

**DSA — Two Sum**

Implement Two Sum first with a brute-force O(N²) double loop, then with a HashMap O(N) solution. The connection: a HashMap lookup is O(1) — the exact reason Redis GET is O(1) and why hash indexes exist in PostgreSQL. You are not just solving a puzzle; you are learning why hash tables are everywhere in backend systems.

---

### Tuesday — Week 1 · Scope, Closures, and the Loop Variable Bug

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest (test framework) |
| 📖 **Concepts** | Lexical scope, closure, `var` vs `let` vs `const`, IIFE, hoisting, Temporal Dead Zone |
| 🎯 **You Build** | `packages/utils/retry.ts` — exponential backoff with jitter, 8 passing tests |
| 🔗 **Why It Matters** | Closures are how you create private state in JavaScript. Every callback, every event handler, every async function uses them. |

**Morning — Scope and Closures Explained**

Scope is the rule that determines where a variable is visible. JavaScript uses **lexical scope** — scope is determined at write time by where you write the code, not at runtime by how you call it.

A **closure** is a function that remembers the variables from its outer scope even after the outer function has returned. This is not a trick — it is how JavaScript works. Every function in JavaScript is a closure.

The famous **loop variable bug**: when you use `var` inside a `for` loop, all the callbacks share the same variable because `var` is function-scoped, not block-scoped. By the time the callbacks run, the loop has already finished and the variable holds its final value. The fix is `let`, which creates a new binding for each loop iteration.

`var` vs `let` vs `const`:

- **`var`** — function-scoped, hoisted to top of function with value `undefined`, can be redeclared
- **`let`** — block-scoped, hoisted but in Temporal Dead Zone (accessing before declaration = `ReferenceError`), cannot be redeclared
- **`const`** — same as `let` but the binding cannot be reassigned — the object it points to can still be mutated

**Evening — Build `withRetry` Utility**

You build a retry utility that wraps any async function and retries it with exponential backoff and random jitter. This demonstrates closures in a real scenario: the configuration (`maxAttempts`, `baseDelayMs`, `jitter`) is captured in the closure and sealed at creation time. Each call to the returned function uses the same closed-over configuration.

**Exponential backoff**: wait 100ms, then 200ms, then 400ms between retries. **Jitter** adds randomness so all retrying clients do not hit your server at exactly the same millisecond — this is a real production technique used by every major cloud client library.

Write 8 Vitest tests verifying every edge case. Run `vitest --coverage` and target 100%.

**DSA — `memoize(fn)`**

Implement `memoize` using a closure over a `Map`. The Map is the cache. The function argument is the cache miss handler. This is conceptually identical to an L1 CPU cache — cheap fast storage in front of expensive slow computation. You will build this same pattern at the database level with Redis in Month 2.

---

### Wednesday — Week 1 · Prototypes, `class`, and the Four Rules of `this`

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Prototype chain, `Object.create`, `class` as syntax sugar, the 4 steps of `new`, `this` binding rules, arrow functions |
| 🎯 **You Build** | `packages/utils/emitter.ts` — EventEmitter from scratch with `on`/`once`/`off`/`emit` |
| 🔗 **Why It Matters** | Node.js's core EventEmitter, Streams, and HTTP server are all built on this prototype system. Understanding it means you can debug any Node.js internals. |

**Morning — How JavaScript Objects Actually Work**

JavaScript does not have classes in the traditional sense. It has **prototypes**. When you look up a property on an object and it is not there, JavaScript automatically looks at the object's prototype, then the prototype's prototype, and so on until it reaches `null`. This is the **prototype chain**.

`class` is syntax sugar over this system. The `class` keyword was added to make the prototype system easier to read — but the underlying mechanism is identical.

The four steps of the `new` keyword when you write `new Foo()`:
1. A new empty object is created
2. Its prototype is set to `Foo.prototype`
3. `this` inside the constructor refers to the new object
4. The constructor runs. If it returns an object, that is returned; otherwise `this` is returned

The **four rules of `this`** — in order of precedence:

- **`new` binding** — `new Foo()` → `this` is the newly created object
- **Explicit binding** — `fn.call(obj)`, `fn.apply(obj)`, `fn.bind(obj)` → `this` is `obj`
- **Implicit binding** — `obj.method()` → `this` is the object before the dot
- **Default binding** — plain `fn()` call → `this` is `globalThis` in non-strict mode, `undefined` in strict mode

**Arrow functions have no own `this`**. They inherit `this` from the surrounding lexical scope. This is why callbacks in class methods often use arrow functions — to avoid losing the class instance as `this`.

**Evening — Build EventEmitter from Scratch**

You implement a typed `EventEmitter` class with `on`, `once`, `off`, and `emit` methods. This demonstrates: private fields using `#` syntax, method chaining by returning `this`, and closure inside `once` where the wrapper function closes over the original listener so it can remove itself after firing. This is the exact pattern Node.js's own `EventEmitter` uses internally.

**DSA — Stack Using Linked List**

Implement a stack where each node is created as an object with a `value` and a `next` pointer. This mirrors how JavaScript's own call stack works conceptually — functions pushed on when called, popped when they return.

---

### Thursday — Week 1 · The Event Loop — The Most Important JavaScript Concept

| | |
|---|---|
| 🛠 **Technologies** | Node.js, `process.nextTick`, `setTimeout`, `setImmediate`, `Promise` |
| 📖 **Concepts** | Call stack, Web APIs/libuv, macrotask queue, microtask queue, event loop tick, `process.nextTick` ordering |
| 🎯 **You Build** | `packages/utils/scheduler.ts` — priority task scheduler using a min-heap |
| 🔗 **Why It Matters** | Every performance bug, every unexpected ordering of operations, every "why did my callback fire at the wrong time" bug is an event loop question. You must own this. |

**Morning — The Event Loop in Depth**

JavaScript runs on a single thread. It can only do one thing at a time. The event loop is the mechanism that makes it feel concurrent.

Three separate areas coordinate execution:

- **Call Stack** — where synchronous code runs. Functions are pushed on when called and popped off when they return. When the stack is empty, the event loop checks the queues.
- **Web APIs / libuv** — handles async operations like `setTimeout`, `fetch`, file I/O. When an async operation completes, its callback is placed in a queue.
- **Queues** — Microtask queue (`Promise.then`, `queueMicrotask`) and Macrotask queue (`setTimeout`, `setInterval`, I/O callbacks). **Microtasks ALWAYS drain completely before the next macrotask runs — no exceptions.**

Node.js adds `process.nextTick`, which fires before any microtasks. So the full order in Node.js is: synchronous code → `process.nextTick` → Promise microtasks → macrotasks.

You predict the output of 20 execution-order puzzles without running them first. Every wrong answer means re-reading the rules. You do not move on until you can predict all 20 correctly.

**Evening — Build Priority Scheduler**

You build a task scheduler that uses a min-heap to run tasks in priority order. Tasks with `delay: 0` use `setImmediate` (runs after I/O). Tasks with a delay use `setTimeout`. Tasks with the same scheduled time run in priority order. This makes the event loop rules concrete — you are manually orchestrating when things run.

**DSA — Min-Heap from Scratch**

Implement `push`, `pop`, and `peek` on a binary min-heap stored as an array. All operations are O(log N). This exact data structure lives inside your scheduler and later inside KVault's LFU cache eviction algorithm.

---

### Friday — Week 1 · Promises, `async/await`, and Generators

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Promise constructor internals, `async/await` as syntax sugar, `Promise.all` vs `allSettled` vs `race` vs `any`, generators, `Symbol.iterator` |
| 🎯 **You Build** | `packages/utils/concurrent.ts` — `ConcurrencyLimiter` + `Promise.all` reimplemented from scratch |
| 🔗 **Why It Matters** | Every database query, every HTTP call, every file operation is a Promise. Misunderstanding these causes silent performance bugs and unhandled rejections. |

**Morning — Promises and `async/await` Demystified**

A Promise is an object that represents a value that will be available in the future. It has three states: pending, fulfilled, rejected. Once settled, it never changes state.

**`async/await` is pure syntax sugar over Promises.** Every `async` function returns a Promise. Every `await` unwraps a Promise and pauses execution of that function — but does NOT block the thread. Other code runs while you are awaiting.

Promise combinators — know when to use each:

- **`Promise.all`** — wait for all to fulfill. If one rejects, the whole thing rejects immediately (fail-fast). Use when all results are required.
- **`Promise.allSettled`** — wait for all to settle (fulfill or reject). Always returns all results. Use when you need to know what happened to each one.
- **`Promise.race`** — first to settle wins — whether fulfilled or rejected. Use for timeouts.
- **`Promise.any`** — first to fulfill wins. Only rejects if ALL reject. Use when any successful result is fine.

**Generators**: a `function*` can pause at `yield` and resume later. They produce values lazily — the next value is not computed until you ask for it. This is how you handle infinite sequences or large datasets without loading everything into memory at once.

**Evening — Build `ConcurrencyLimiter` and reimplement `Promise.all`**

`ConcurrencyLimiter`: a class that ensures at most N async operations run simultaneously. If you have 100 database inserts to make and N=10, it runs 10 at a time, starting the next one as soon as any current one finishes. This prevents thundering-herd scenarios where you accidentally open 100 simultaneous database connections.

Reimplementing `Promise.all` from scratch forces you to understand: how results maintain their order even when promises settle out of order, how a single rejection triggers the overall rejection, and why you need `Promise.resolve(p)` to handle non-Promise values. Write 10 tests verifying every edge case.

### Weekend Capstone — FleetPulse v0.1

All utilities are tested and benchmarked: `retry`, `memoize`, `emitter`, `scheduler`, `ConcurrencyLimiter`, `promiseAll`. The FleetPulse GPS receiver handles 500 concurrent requests. Monorepo CI is green. You have a shared `packages/types` with `Driver`, `WorkOrder`, `Order`, `GpsPing` interfaces.

---

## Week 2 — JavaScript Applied: Modules, Functional Patterns, DOM, TypeScript

---

### Monday — Week 2 · CommonJS vs ESM and Functional Programming Patterns

| | |
|---|---|
| 🛠 **Technologies** | Node.js (`require`/`import`), TypeScript, Vitest |
| 📖 **Concepts** | CommonJS module system, ES Modules, tree shaking, circular dependencies, `map`/`filter`/`reduce`, `pipe`/`compose`, currying |
| 🎯 **You Build** | `packages/utils/fp.ts` — `pipe`, `compose`, `curry`, `partial`, `memoize` with TypeScript generics |
| 🔗 **Why It Matters** | Module systems determine how your code is bundled and tree-shaken. Functional patterns reduce bugs by making data flow explicit. |

**Morning — How JavaScript Modules Work**

There are two module systems in Node.js and they work very differently:

- **CommonJS (`require`)** — synchronous: `require()` blocks until the file is loaded. Modules are cached after first load. Circular dependencies return a partially-constructed object. This is Node.js's original system, still used in most npm packages.
- **ES Modules (`import`)** — static: the import graph is analyzed before any code runs. This enables **tree shaking** (removing unused exports at build time). `dynamic import()` is asynchronous. Circular dependencies are handled differently from CommonJS.

Functional programming patterns — implement each from scratch before using the built-ins:

- **`map`** — transform each element: `[1,2,3].map(x => x*2) = [2,4,6]`. It is a `for` loop that collects results.
- **`filter`** — keep elements matching a predicate. It is a `for` loop that only collects when the condition is true.
- **`reduce`** — collapse an array into a single value by accumulating. The most general of the three — `map` and `filter` can both be implemented with `reduce`.
- **`pipe`** — applies functions left to right: `pipe(double, addOne)(5)` = `addOne(double(5))` = `11`.
- **`compose`** — applies functions right to left. The mathematical convention. `pipe` is `compose` with arguments reversed.
- **`curry`** — transform a function of N arguments into N chained functions of 1 argument each. `add(2)(3)` instead of `add(2,3)`. Enables partial application.

**DSA — LRU Cache**

Implement an LRU (Least Recently Used) cache using a `Map` + doubly linked list. The Map gives O(1) lookup. The linked list tracks access order in O(1). This exact data structure is how Redis implements its key eviction policy. This is the Month 8 KVault project in miniature.

---

### Tuesday — Week 2 · Immutability, Structural Sharing, WeakMap

| | |
|---|---|
| 🛠 **Technologies** | TypeScript, `structuredClone`, `WeakMap`, `WeakRef` |
| 📖 **Concepts** | Shallow copy vs deep clone, structural sharing, referential equality, immutable data structures, garbage collection |
| 🎯 **You Build** | Persistent (immutable) linked list and binary search tree where `insert` creates a new path |
| 🔗 **Why It Matters** | React's entire re-render system is built on referential equality (`===`). Mutation breaks React silently. Understanding immutability prevents the hardest category of React bugs. |

**Morning — Why Mutation Is Dangerous**

Spread syntax creates a shallow copy: the top level is new, but nested objects still share the same reference. If you mutate a nested object, both the original and the copy reflect the change.

`structuredClone` creates a true deep copy — handles `Date`, `Map`, `Set`, and circular references.

**Why React cares**: React determines whether to re-render by checking if `state === previousState`. If you mutate an object in place, the reference is the same, so React thinks nothing changed and skips the render. Your data changed but the UI did not update — a silent bug.

**Structural sharing**: Immer.js and persistent data structures only copy the parts that changed. An insert into a 1000-node tree only copies the nodes on the path from root to the new node — O(log N) copies, not O(N).

**WeakMap**: keys are held weakly — if the key object is garbage collected, the entry is automatically removed. Use this to attach metadata to DOM nodes without preventing those nodes from being garbage collected when removed from the DOM.

---

### Wednesday — Week 2 · DOM, Browser APIs, Vanilla JS Data Fetching

| | |
|---|---|
| 🛠 **Technologies** | Browser DOM APIs, `fetch`, `AbortController`, `IntersectionObserver`, `Canvas`, `requestAnimationFrame` |
| 📖 **Concepts** | DOM tree, event bubbling vs capturing, event delegation, `AbortController`, lazy loading |
| 🎯 **You Build** | FleetPulse + RouteMaster driver/order list in pure vanilla JS — no React, no libraries |
| 🔗 **Why It Matters** | You will appreciate what React solves only after you've done it by hand. React, Angular, and Vue all use these exact DOM APIs underneath. |

**Morning — The Browser Document Model**

**Event bubbling**: when you click a button inside a `div`, the click event fires on the button first, then bubbles up to the `div`, then `body`, then `window`. **Capturing** is the reverse — top down before bubbling starts.

**Event delegation**: instead of adding one click listener to each of 1000 list items, add one listener to the parent list. Use `event.target` to determine which child was clicked. This is O(1) listeners regardless of list size — the same scaling principle as PostgreSQL indexes.

**`AbortController`**: cancels both `fetch` requests and `addEventListener`. Without proper cleanup, you create memory leaks — especially dangerous in single-page applications where components mount and unmount frequently.

**Evening — Build Driver and Order Lists in Pure JS**

You build real UI for two platforms without any framework. This forces you to handle: updating the DOM when data changes, cleaning up event listeners on unmount, cancelling in-flight network requests, and animating elements on a canvas. When you later use React, you will know exactly what problem each React feature is solving.

---

### Thursday — Week 2 · TypeScript Deep: Generics, Conditional Types, Branded Types

| | |
|---|---|
| 🛠 **Technologies** | TypeScript compiler, `tsconfig.json` strict mode |
| 📖 **Concepts** | Generic type parameters, constraints, conditional types, `infer`, mapped types, template literal types, branded/nominal types |
| 🎯 **You Build** | `packages/types` updated — all IDs become branded types, `ApiResponse<T>` conditional type |
| 🔗 **Why It Matters** | TypeScript without generics and branded types is just annotated JavaScript. Branded types eliminate an entire class of bugs where the wrong ID is passed to the wrong function. |

**Morning — TypeScript Type System Mastery**

**Generics** let you write functions and types that work for any type while still being type-safe. `function identity<T>(x: T): T` — `T` is a type parameter, filled in at call time. Constraints let you require that `T extends` a specific shape.

**Conditional types**: `T extends U ? X : Y` — evaluated at compile time. The `infer` keyword extracts a type from within another type during conditional evaluation.

**Branded types** are one of the most practical TypeScript techniques:

```typescript
type UserId  = string & { readonly _brand: 'UserId' };
type DriverId = string & { readonly _brand: 'DriverId' };
```

Both are strings at runtime. But TypeScript treats them as incompatible. You cannot accidentally pass a `DriverId` to a function that expects a `UserId` — TypeScript catches it at compile time. This eliminates a whole category of runtime bugs where IDs get mixed up, extremely common in systems with many entity types.

---

### Friday — Week 2 · Zod — Runtime Validation + TypeScript Types from One Schema

| | |
|---|---|
| 🛠 **Technologies** | Zod, TypeScript |
| 📖 **Concepts** | Schema validation, `z.infer` for type inference, discriminated unions, recursive schemas, refinements, single source of truth |
| 🎯 **You Build** | `packages/schemas` — all schemas for all 4 platforms: FleetPulse, AeroOps, RouteMaster, OpsAI |
| 🔗 **Why It Matters** | Zod gives you both runtime validation and TypeScript types from a single declaration. Change one thing, errors propagate everywhere. |

**Morning — One Schema, Two Guarantees**

The core insight of Zod: a schema declaration gives you two things simultaneously:

1. **Runtime validation** — `z.schema.safeParse(data)` tells you if external data matches your expected shape, at runtime, with detailed error messages
2. **TypeScript type** — `z.infer<typeof schema>` extracts the TypeScript type from the schema automatically, with no duplication

Without Zod, you would write a TypeScript interface AND separately write validation logic. These two can drift apart. With Zod, they are the same thing by definition.

Key Zod patterns:
- **`z.discriminatedUnion`** — when a field determines the shape of the rest of the object
- **`z.lazy`** — for recursive schemas where a type references itself
- **`z.refine`** — add custom validation logic (e.g. assert latitude is between -90 and 90)
- **`.transform`** — clean data during parsing: trim whitespace, parse dates, convert string numbers

### Weekend Capstone — All 4 Platform Shells

All 4 platforms have raw Node.js HTTP servers. `packages/utils` is complete with tests. `packages/types` and `packages/schemas` are the shared foundation for the entire monorepo. GitHub Actions CI is green.

---

## Week 3 — Node.js Internals: V8, libuv, Streams, `worker_threads`, `crypto`

---

### Monday — Week 3 · V8 Architecture: How Node.js Runs Your Code

| | |
|---|---|
| 🛠 **Technologies** | Node.js `--inspect` flag, Chrome DevTools, `node-heapdump` |
| 📖 **Concepts** | JIT compilation, hidden classes, inline caching, garbage collection, young vs old generation, GC pauses |
| 🎯 **You Build** | Flame graph analysis of two function versions — showing hidden class deoptimization and its fix |
| 🔗 **Why It Matters** | Understanding V8 lets you write code that runs 10x faster by not accidentally triggering deoptimization. |

**Morning — Inside the V8 Engine**

V8 is the JavaScript engine inside Node.js. It turns your JavaScript into machine code. The pipeline:

- **Parser** → reads source code and produces an AST
- **Ignition** → compiles the AST to bytecode — fast to produce, executed immediately
- **TurboFan** → JIT compiler that watches hot bytecode and compiles it to optimized native machine code

**Hidden classes**: V8 tracks the shape of objects. Objects with properties added in the same order share a hidden class, allowing V8 to generate optimized property access code. Adding properties in different orders creates different hidden classes and triggers deoptimization.

**Garbage collection**: V8 uses a generational GC. New objects start in the **young generation** — collected frequently and cheaply. Objects that survive several collections are promoted to the **old generation** — collected infrequently but with a longer "stop the world" pause. Allocating many short-lived objects in hot paths (like inside request handlers) causes GC pauses that hurt latency.

---

### Tuesday — Week 3 · Node.js Streams: Backpressure and `pipeline()`

| | |
|---|---|
| 🛠 **Technologies** | Node.js `stream/promises`, `Transform`, `Writable`, `fs.createReadStream` |
| 📖 **Concepts** | Readable (push vs pull), Writable (`drain` event, `highWaterMark`), `Transform`, backpressure, `pipeline()` |
| 🎯 **You Build** | FleetPulse GPS pipeline — process a 200MB log file using 20MB constant RAM |
| 🔗 **Why It Matters** | Streams are the right tool for any data larger than available RAM, or any data that should start processing before it is fully received. |

**Morning — Streams: How Node.js Handles Large Data**

Without streams: `readFile` loads the entire file into memory. A 200MB file = 200MB RAM spike.

With streams: data flows in chunks. Each chunk is processed and then garbage collected. Memory usage stays constant regardless of file size.

**Backpressure**: when the writable side cannot consume data as fast as the readable side produces it, the internal buffer fills up. `writable.write()` returns `false` when the buffer is full, signaling the readable to pause. When the buffer drains, the `drain` event fires and the readable resumes. Without handling backpressure, you buffer everything in memory and crash.

`pipeline()` handles backpressure automatically AND destroys all streams in the pipeline if any one errors. **Always use `pipeline()` instead of manual `.pipe()` chaining.**

**Evening — GPS Pipeline**

You build a multi-stage transform pipeline:
1. Read GPS event log line by line (Readable)
2. Validate each line with Zod (Transform — invalid lines emitted as events)
3. Enrich each ping with zone information (Transform)
4. Batch 500 records and bulk-insert into PostgreSQL using `CopyFrom` (Writable)

Memory usage stays below 25MB throughout. This is the technique used by every data pipeline in production.

---

### Wednesday — Week 3 · Event Loop Phases Deep + `worker_threads` + `cluster`

| | |
|---|---|
| 🛠 **Technologies** | Node.js `worker_threads`, `cluster`, `SharedArrayBuffer`, `Atomics` |
| 📖 **Concepts** | Six event loop phases in order, poll phase waiting, `setImmediate` vs `setTimeout`, `worker_threads` for CPU parallelism, `cluster` for multi-process |
| 🎯 **You Build** | CPU-bound password hashing benchmark — single thread vs 4 worker threads showing true parallelism |
| 🔗 **Why It Matters** | Node.js is single-threaded but can use multiple CPU cores with `worker_threads`. Understanding when to use each prevents building servers that waste available hardware. |

**Morning — The Six Event Loop Phases**

The Node.js event loop has six phases that execute in order every tick:

1. **Timers** — execute callbacks from `setTimeout` and `setInterval` whose delay has expired
2. **Pending callbacks** — I/O error callbacks deferred from the previous iteration
3. **Idle / prepare** — internal Node.js use only
4. **Poll** — retrieve new I/O events. If the poll queue is empty and there are no timers, Node.js **waits here** for I/O. This is why Node.js is efficient at I/O — it sleeps until work arrives.
5. **Check** — execute `setImmediate` callbacks
6. **Close callbacks** — `socket.on("close")` and similar

`process.nextTick` fires after the current operation completes, before moving to any queue. Promise microtasks fire after `nextTick`.

`worker_threads`: spawns a new V8 instance in a separate thread — **true parallelism**. For CPU-bound work (hashing, image processing, compression) this uses multiple CPU cores. `SharedArrayBuffer` lets threads share memory directly.

`cluster`: forks separate Node.js processes, each with their own event loop. They share a port via the OS. This is how you use all CPU cores for I/O-heavy servers.

---

### Thursday — Week 3 · `crypto`, `net` Module, `AsyncLocalStorage`

| | |
|---|---|
| 🛠 **Technologies** | Node.js `crypto`, `net`, `AsyncLocalStorage` |
| 📖 **Concepts** | HMAC-SHA256 webhook signing, raw TCP protocol parsing, request-scoped context propagation |
| 🎯 **You Build** | HMAC webhook signature verifier (reused in DungBeetle), request-scoped logger with automatic `requestId`/`traceId` |
| 🔗 **Why It Matters** | Webhook security, distributed tracing, and protocol implementation are core backend engineering skills. |

**Morning — Cryptography and Network Primitives**

**HMAC**: when DungBeetle sends a webhook to a third-party service, the receiver needs to verify the payload has not been tampered with. You sign the request body with a shared secret key using HMAC-SHA256 and include the signature in a header. The receiver computes the same signature and compares — if they match, the payload is authentic.

**`net` module**: gives you raw TCP sockets — the layer below HTTP. Understanding this makes you a better HTTP debugger. KVault in Month 8 implements Redis's RESP3 protocol directly over raw TCP.

**`AsyncLocalStorage`**: Node.js has no thread-local storage. But you often need request-scoped data (like a `requestId`) to be available deep in the call stack without passing it through every function. `AsyncLocalStorage` propagates data through the async call chain automatically — it works with `await`, `Promise.then`, `setTimeout`, and `EventEmitter`. This is how OpenTelemetry traces requests across services without modifying every function signature.

---

### Friday — Week 3 · Performance Profiling: Flame Graphs and `clinic.js`

| | |
|---|---|
| 🛠 **Technologies** | `node --inspect`, `clinic.js`, `autocannon`, `perf_hooks` |
| 📖 **Concepts** | Flame graph interpretation, top allocators, GC pressure measurement, HTTP load testing |
| 🎯 **You Build** | Before/after benchmark showing `JSON.parse` replacement reducing allocations per request |
| 🔗 **Why It Matters** | Optimization without profiling is guessing. Profiling finds the actual bottleneck — which is almost never where you expect. |

**Morning — How to Profile Node.js**

A flame graph shows which functions are consuming CPU time. The width of each block = percentage of time spent in that function. The height = call depth.

In the GPS pipeline, the top allocator is almost always `JSON.parse`. For every request, a new object is allocated, filled, and then garbage collected. Replacing batch `JSON.parse` with streaming JSON parsing reduces GC pressure significantly. `clinic.js doctor` automates bottleneck detection — it runs your server, profiles it, and tells you whether the bottleneck is I/O, CPU, or GC.

---

## Week 4 — TypeScript Advanced + Auth + PostgreSQL + Redis + Databases

---

### Monday–Tuesday — Week 4 · JWT Authentication, RBAC, and Advanced TypeScript

| | |
|---|---|
| 🛠 **Technologies** | TypeScript declaration merging, JWT RS256, Redis, Express middleware |
| 📖 **Concepts** | Asymmetric cryptography for auth, access vs refresh tokens, role-based access control, TypeScript module augmentation |
| 🎯 **You Build** | `packages/auth` — shared JWT middleware with RBAC used by all 4 Express APIs |
| 🔗 **Why It Matters** | Auth bugs are security vulnerabilities. RS256 means only your auth server can issue tokens — any service can verify without having the secret. |

**Concepts — JWT RS256**

RS256 uses asymmetric cryptography: a private key signs the token, a public key verifies it. This is important because you can give every service the public key without risk — they can verify tokens but cannot create them. With HS256 (symmetric), every service that verifies tokens also has the power to create them — a much larger attack surface.

**Access tokens** are short-lived (15 minutes). **Refresh tokens** are long-lived (7 days) and stored in Redis. Logout is implemented by deleting the refresh token from Redis — even if someone steals an access token, it expires in 15 minutes and cannot be refreshed.

**TypeScript module augmentation**: you use declaration merging to extend the Express `Request` interface globally — every file in your project sees `req.user` without casting.

---

### Wednesday — Week 4 · PostgreSQL First Contact: Indexes, `EXPLAIN ANALYZE`, N+1

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `node-postgres`, SQL |
| 📖 **Concepts** | B-tree indexes, partial indexes, `EXPLAIN ANALYZE` output, sequential scan vs index scan, N+1 query problem, JOINs |
| 🎯 **You Build** | All 4 platform schemas with proper indexes. Before/after `EXPLAIN ANALYZE` comparison documented. |
| 🔗 **Why It Matters** | Unindexed queries are one of the most common causes of production outages. `EXPLAIN ANALYZE` is the tool you use to find them. |

**Concepts — How PostgreSQL Executes Queries**

A **sequential scan** reads every row in a table. For a 10-million-row table, this takes seconds. An **index scan** jumps directly to matching rows. Creating the right index turns a 3-second query into a 3-millisecond query.

`EXPLAIN ANALYZE` shows you the query plan PostgreSQL chose. You look for "Seq Scan" on large tables — that is the performance bug. Add an index on the column in the `WHERE` clause and re-run.

**Partial index**: `CREATE INDEX idx ON trips(driver_id) WHERE status='pending'` — an index that only includes rows matching a condition. Much smaller than a full index. The pending trips index is tiny even when the trips table has 100 million historical rows.

**N+1 problem**: fetch 20 trips (1 query), then for each trip fetch the driver name (20 queries) = 21 total queries. Fix: one JOIN that fetches drivers alongside trips in 1 query. You demonstrate this, measure the difference, and fix it.

---

### Thursday — Week 4 · Redis: Every Data Structure with Real Use Cases

| | |
|---|---|
| 🛠 **Technologies** | Redis, `node-redis` or `ioredis` |
| 📖 **Concepts** | String, Hash, List, Set, Sorted Set, Stream data structures, TTL jitter, Lua scripts for atomicity |
| 🎯 **You Build** | Rate limiter using Sorted Set, driver session cache using Hash, job queue using List |
| 🔗 **Why It Matters** | Redis is used in almost every production backend. Using the wrong data structure means using 10x more memory or 10x more CPU. |

**Concepts — Redis Data Structures and When to Use Each**

| Structure | Use Case | Complexity |
|-----------|----------|------------|
| **String** | Simple values, counters (`INCR`), atomic flags (`SETNX` for leader election) | O(1) get/set |
| **Hash** | Objects with multiple fields: `HSET driverProfile:123 lat 12.97` | O(1) per field |
| **List** | Queues: `LPUSH jobs newJob`, `BLPOP worker 0` (blocking pop — waits until something arrives) | O(1) push/pop from ends |
| **Set** | Membership: `SADD active_drivers d-123`, `SISMEMBER active_drivers d-456` | O(1) add/check |
| **Sorted Set** | Leaderboards, rate limiting. `ZADD` with a score, `ZRANGEBYSCORE` to query by range | O(log N) |
| **Stream** | Append-only log: `XADD`/`XREAD`. This is the conceptual model behind Kafka. | O(log N) |

**TTL jitter**: always add random jitter to TTLs: `EX base + random(jitter)`. Without jitter, all keys set at the same time expire at the same time, causing a thundering herd of simultaneous cache misses that overwhelm the database.

---

### Friday — Week 4 · Database Selection: SQLite, MongoDB, PGVector, Convex + ADRs

| | |
|---|---|
| 🛠 **Technologies** | SQLite, MongoDB, PGVector, Convex |
| 📖 **Concepts** | ACID vs BASE tradeoffs, embedded vs server databases, vector similarity search, reactive queries, Architecture Decision Records |
| 🎯 **You Build** | One ADR (Architecture Decision Record) for every database choice across all 4 platforms |
| 🔗 **Why It Matters** | Using PostgreSQL for everything is not always right. Good engineers choose the right tool and document why. |

**Concepts — When to Use Each Database**

- **PostgreSQL** — default choice. Strong consistency, ACID transactions, powerful query language. Use when data is relational and consistency matters.
- **SQLite** — embedded, no server process. AeroOps uses this for hangar mode (offline aircraft inspections with no network).
- **MongoDB** — schema-flexible document storage. AeroOps uses it for inspection reports that have wildly different shapes for different aircraft types.
- **PGVector** — PostgreSQL extension for storing and querying vector embeddings. Used in OpsAI for semantic search. Queries like "find maintenance procedures similar to this description" use cosine distance between vectors.
- **Convex** — reactive database: subscribers are notified when their query result changes. RouteMaster's real-time order tracking uses this instead of polling.

An **ADR** is a one-page document capturing: the context, the options considered, the decision made, and the tradeoffs. Writing ADRs forces clarity in reasoning and documents decisions for future engineers.

### Weekend Capstone — All 4 Platforms Full-Stack v1.0

All 4 platforms have a complete stack: React frontend ← Express API ← PostgreSQL + Redis + JWT with 3 role levels. RouteMaster adds Convex. AeroOps adds MongoDB and SQLite offline mode. OpsAI adds PGVector.

---

---

# MONTH 2 — JavaScript Applied: Node.js Mastery + Streams + Performance

> Month 1 was the engine. Month 2 is the vehicle. You learn the Node.js stdlib deeply — every module you use in production. By the end of Month 2, you can write production Node.js without reaching for tutorials.

---

## Week 5 — Node.js Stdlib Deep: `net`, `crypto`, `child_process`, `perf_hooks`

---

### Monday — Week 5 · Raw TCP, HTTP Internals, `net` Module

| | |
|---|---|
| 🛠 **Technologies** | Node.js `net` module, `http` module |
| 📖 **Concepts** | TCP connection lifecycle, HTTP/1.1 request parsing, keep-alive, connection pooling, `http.Agent` |
| 🎯 **You Build** | Raw TCP echo server, then minimal HTTP/1.1 parser showing how `http.createServer` works underneath |
| 🔗 **Why It Matters** | When an HTTP connection resets in production, or chunked encoding behaves unexpectedly, or keep-alive causes memory leaks, you need to understand the TCP layer. |

TCP is the transport layer. HTTP is built on top of TCP. The `net` module gives you raw TCP. You build a server that accepts connections, reads data, and sends it back. Then you build an HTTP/1.1 parser on top — read the request line, parse headers, read the body. This is exactly what Node.js's `http` module does for you. Seeing it demystifies every HTTP behavior you have ever found mysterious.

`http.Agent` manages a pool of TCP connections to the same host. Without it, every HTTP request opens a new TCP connection (expensive). With it, connections are reused. Connection pooling is a fundamental pattern — PostgreSQL's PgBouncer does the same thing.

---

### Tuesday — Week 5 · `child_process`, Shell Scripting, `worker_threads` Deep

| | |
|---|---|
| 🛠 **Technologies** | Node.js `child_process`, `worker_threads`, `SharedArrayBuffer`, `Atomics` |
| 📖 **Concepts** | `spawn` vs `exec` vs `fork`, shell injection attacks, `SharedArrayBuffer` memory layout, lock-free synchronization with `Atomics` |
| 🎯 **You Build** | Shell script executor with sanitized input, lock-free counter using `SharedArrayBuffer` + `Atomics` |
| 🔗 **Why It Matters** | Shell injection is a critical security vulnerability. Lock-free synchronization is how databases achieve high concurrency without mutex bottlenecks. |

`child_process.spawn`: runs a process without a shell. Safe against shell injection because arguments are passed as an array, not interpolated into a command string.

`child_process.exec`: runs a command **through a shell**. **NEVER use with unsanitized user input.** If a user can control any part of the command string, they can execute arbitrary commands on your server.

`Atomics` provides operations that are guaranteed to be atomic — read-modify-write with no race conditions. This is the foundation of lock-free data structures.

---

### Wednesday — Week 5 · `perf_hooks`, `v8`, Memory Profiling

| | |
|---|---|
| 🛠 **Technologies** | Node.js `perf_hooks`, `v8` module, `--expose-gc` flag |
| 📖 **Concepts** | High-resolution timers, `PerformanceObserver`, heap statistics, GC monitoring, memory leak detection |
| 🎯 **You Build** | Memory usage tracker sampling heap every 100ms, alerting when old generation exceeds threshold |
| 🔗 **Why It Matters** | Memory leaks in long-running servers are discovered through heap monitoring. This is the technique used in production observability systems. |

`performance.now()` gives microsecond resolution timing. `Date.now()` only has millisecond resolution and can go backwards (NTP corrections). **For benchmarking, always use `performance.now()`.**

`v8.getHeapStatistics()` tells you: total heap size, used heap size, heap size limit, how much is in the old generation. Sampling this every 100ms gives you a memory pressure signal you can alert on before the process runs out of memory and crashes.

---

### Thursday — Week 5 · `AsyncLocalStorage` Advanced + OpenTelemetry Preview

| | |
|---|---|
| 🛠 **Technologies** | Node.js `AsyncLocalStorage`, OpenTelemetry |
| 📖 **Concepts** | Request-scoped context propagation, distributed tracing, trace context without prop-drilling |
| 🎯 **You Build** | Request-scoped logger that automatically includes `requestId`, `userId`, `traceId` in every log line |
| 🔗 **Why It Matters** | In production, you need to trace a single request through all the services it touches. `AsyncLocalStorage` is how this works without threading context through every function. |

The problem: a request comes in, generates a unique `requestId`, and calls 10 different functions. You want every log line from every function to include the `requestId`. Without `AsyncLocalStorage`, you pass `requestId` as a parameter to every function — this is prop-drilling and makes every function signature noisy.

`AsyncLocalStorage` propagates data through all async operations in the same chain — `await`, `Promise.then`, `setImmediate`, `setTimeout`, `EventEmitter`. Any code in the chain can read it without receiving it as a parameter.

---

### Friday — Week 5 · Performance: `clinic.js` Flame Graphs and `autocannon`

| | |
|---|---|
| 🛠 **Technologies** | `clinic.js`, `autocannon`, `node --inspect` |
| 📖 **Concepts** | CPU flame graph reading, identifying top allocators, streaming JSON parsing, HTTP load testing |
| 🎯 **You Build** | Optimized GPS pipeline with before/after benchmark showing reduced allocation per request |
| 🔗 **Why It Matters** | `clinic.js` is used by Node.js core team contributors to identify regressions. Knowing how to use it sets you apart. |

---

## Week 6 — TypeScript Mastery + Shared Packages Complete + DungBeetle Scaffold

---

### Monday–Tuesday — Week 6 · TypeScript Compiler API + Declaration Files

| | |
|---|---|
| 🛠 **Technologies** | TypeScript, `tsc --noEmit`, `tsconfig.json` |
| 📖 **Concepts** | Declaration files (`.d.ts`), module augmentation, `process.env` typing, compile-time assertions, strict mode options |
| 🎯 **You Build** | Typed Express `Request` with `user` field, typed `process.env`, compile-time test using `expectType` |
| 🔗 **Why It Matters** | TypeScript strict mode with `noUncheckedIndexedAccess` catches an entire class of runtime errors at compile time, for zero runtime cost. |

`tsc --noEmit` as a zero-cost test: it runs in CI and catches type errors without producing any output files. `noUncheckedIndexedAccess` makes `arr[i]` return `T | undefined` — forcing you to check bounds. `exactOptionalPropertyTypes` makes a property typed as `string?` different from `string | undefined`.

---

### Wednesday — Week 6 · `packages/api` — Typed Fetch Client

| | |
|---|---|
| 🛠 **Technologies** | TypeScript generics, `fetch`, `AbortController`, Zod |
| 📖 **Concepts** | Generic HTTP client, request/response type safety, error type narrowing, abort signal propagation |
| 🎯 **You Build** | `packages/api` — typed fetch wrapper used by all 4 platforms: request body validated, response parsed through Zod |
| 🔗 **Why It Matters** | Untyped API calls are where type safety breaks down at the boundary between frontend and backend. This eliminates that gap. |

---

### Thursday–Friday — Week 6 · DungBeetle Scaffold: Job Queue with PostgreSQL + Redis

| | |
|---|---|
| 🛠 **Technologies** | Node.js, Express, PostgreSQL (`SELECT FOR UPDATE SKIP LOCKED`), Redis |
| 📖 **Concepts** | Concurrent job claiming with advisory locks, `SELECT FOR UPDATE SKIP LOCKED`, Redis as status cache, singleflight deduplication |
| 🎯 **You Build** | DungBeetle v0.1 — job queue in Node.js: workers claim jobs atomically, process them, mark complete |
| 🔗 **Why It Matters** | `SELECT FOR UPDATE SKIP LOCKED` is the correct SQL pattern for job queues. Without `SKIP LOCKED`, every worker tries to lock the same row and blocks. With it, each worker atomically claims the next available job. |

`SELECT FOR UPDATE SKIP LOCKED`: multiple workers query for pending jobs simultaneously. Without locking, two workers could claim the same job. `WITH SELECT FOR UPDATE`, they block on the same row. `WITH SKIP LOCKED`, each worker finds the next row that is NOT already locked — workers jump over rows being processed by others and claim the next available one.

This Node.js implementation is the baseline. In Month 3, you rewrite DungBeetle in Go. In Month 5, you add Kafka. By Month 9, it runs AI job orchestration.

### Weekend Capstone — All Packages Production-Ready + DungBeetle Node.js v0.1

`packages/utils`, `packages/types`, `packages/schemas`, `packages/auth`, `packages/api` are all complete, tested, and used by all 4 platforms. DungBeetle Node.js v0.1 is running. This is the end of the JavaScript phase.

---

---

# MONTH 3 — Go Mastery: Language, Concurrency, Stdlib, Benchmarking

> Go is the primary backend language for 6 of the 9 projects. One full month on the language before any project uses it in production. Every day ends with `go test -race ./...` passing and `goleak.VerifyNone(t)` confirming zero goroutine leaks.

---

## Week 7 — Go Language Core: Types, Interfaces, Error Handling, Closures

---

### Monday — Week 7 · Go Module System + Types + Interfaces

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22+, `go mod`, VS Code with `gopls` |
| 📖 **Concepts** | `go.mod`, `go.sum`, `internal` packages, zero values, type definitions vs aliases, implicit interface satisfaction |
| 🎯 **You Build** | Go reimplementation of `packages/utils` — `retry`, `emitter`, `concurrent` — noticing Go's explicit error returns vs JS `try/catch` |
| 🔗 **Why It Matters** | Go's zero values mean every type is always valid. Go's implicit interfaces mean you never need to declare that you implement something. |

**Concepts**

**Zero values**: Go initializes every variable to a known zero value: `0` for numbers, `""` for strings, `false` for booleans, `nil` for pointers/slices/maps/channels. A zero-valued struct is always valid. You never have uninitialized memory bugs.

**Interfaces work by implicit satisfaction** — no `implements` keyword. If your type has the methods, it satisfies the interface. This enables loose coupling: code depends on interfaces, not concrete types.

**Key insight when reimplementing utilities**: Go's explicit error return — `func doThing() (Result, error)` — forces you to handle every error at the call site. JavaScript's `try/catch` lets errors propagate silently if you forget to catch them. Go's approach is more verbose but makes failure modes impossible to ignore.

---

### Tuesday — Week 7 · Error Handling, Slices, Maps, Structs

| | |
|---|---|
| 🛠 **Technologies** | Go standard library, `errors` package, `fmt.Errorf` |
| 📖 **Concepts** | Error wrapping with `%w`, `errors.Is`/`As`, sentinel errors, custom error types, slice internals (pointer+len+cap), `append` reallocation, nil map panic |
| 🎯 **You Build** | FleetPulse zone lookup in Go — `map[string]Zone`, custom error types, 20 table-driven tests |
| 🔗 **Why It Matters** | Go's error wrapping lets you add context at each layer while preserving the original error for programmatic inspection. |

`fmt.Errorf("zone lookup %s: %w", name, err)` — the `%w` verb wraps the error. `errors.Is(err, ErrNotFound)` unwraps and checks if any error in the chain matches. This lets you check for specific error types at any level of the call stack, even through multiple wraps.

**Slices**: a slice is a three-field header (pointer to array, length, capacity). When you `append` beyond capacity, Go allocates a new, larger array and copies. If you pass a slice to a function and append inside, the original slice's header doesn't change.

**Maps**: a `nil` map (`var m map[string]int`) **panics on write**. Always `make(map[string]int)`. Map iteration order is randomized intentionally.

---

### Wednesday — Week 7 · Closures, `defer`, `panic`/`recover`

| | |
|---|---|
| 🛠 **Technologies** | Go, `goleak` |
| 📖 **Concepts** | Go closures (same loop variable bug as JS), `defer` LIFO semantics, deferred cleanup guarantees, `panic` vs `error`, `recover` in deferred functions |
| 🎯 **You Build** | Resource pool with deferred cleanup — `panic` inside critical section still releases the resource |
| 🔗 **Why It Matters** | `defer` + `panic`/`recover` is Go's answer to `try/finally`. Used correctly, it guarantees cleanup even in exceptional conditions. |

Go closures close over variables exactly like JavaScript closures. The same loop variable bug exists. The same fixes work.

**`defer`**: schedules a function call to run when the current function returns — whether normally, via `return`, or via `panic`. The canonical pattern:
```go
mu.Lock()
defer mu.Unlock()  // put defer immediately after lock — never separate them
// critical section
```
The defer ensures the mutex is always unlocked, even if a panic occurs or the function has multiple return paths.

**`panic`/`recover`**: `panic` is NOT for normal error flow — use it only for truly unrecoverable states (programmer errors, invariant violations). For expected errors, use the `error` return pattern.

---

### Thursday — Week 7 · Build System, `go vet`, `golangci-lint`

| | |
|---|---|
| 🛠 **Technologies** | `go vet`, `golangci-lint`, `staticcheck`, `errcheck`, `gocritic` |
| 📖 **Concepts** | Static analysis, `errcheck` (every error must be checked), `staticcheck` (real bugs the compiler misses), build tags for OS-specific code |
| 🎯 **You Build** | `golangci-lint` configured for the entire monorepo. Every lint warning fixed. |
| 🔗 **Why It Matters** | `errcheck` catches every ignored error. Ignoring errors in Go is the equivalent of writing `catch(e) {}` in JavaScript — silent failures that become mysterious production bugs. |

---

### Friday — Week 7 · Generics in Go (1.18+)

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22, type parameters |
| 📖 **Concepts** | Type parameters, constraints (`any`/`comparable`/`~int`), generic functions and types, when to use generics vs interfaces |
| 🎯 **You Build** | Generic `Result[T]` type, generic `Set[T comparable]`, generic `OrderedMap[K,V]`. Rewritten `ConcurrencyLimiter` and `withRetry` using generics. |
| 🔗 **Why It Matters** | Go generics eliminate code duplication without sacrificing type safety. Before generics, you'd write separate `IntSet`, `StringSet`, etc. Now one `Set[T]` handles all. |

---

## Week 8 — Go Concurrency: Goroutines, Channels, `sync`, `errgroup`

---

### Monday — Week 8 · Goroutines and the Go Scheduler (M:N Model)

| | |
|---|---|
| 🛠 **Technologies** | Go runtime, `runtime` package, `goleak` |
| 📖 **Concepts** | M:N scheduler, Goroutine (G), OS thread (M), Processor (P), `GOMAXPROCS`, work stealing, goroutine stack growth, cooperative vs async preemption |
| 🎯 **You Build** | 10 programs demonstrating goroutine creation patterns. `goleak.VerifyNone(t)` added to every test. |
| 🔗 **Why It Matters** | The Go scheduler is why you can run 100,000 goroutines on 8 CPU cores. Understanding it explains goroutine leaks, deadlocks, and why some concurrent programs are unexpectedly slow. |

**M:N scheduling**: N goroutines run on M OS threads, where M is typically the number of CPU cores (`GOMAXPROCS`). A goroutine starts at 2KB of stack — tiny compared to OS threads (1MB+). Go can run millions of goroutines on modest hardware.

- **G** (Goroutine): a unit of concurrent execution
- **M** (Machine): an OS thread
- **P** (Processor): a logical CPU that runs goroutines. Each P has a local run queue. If a P's run queue is empty, it steals goroutines from another P's queue (**work stealing**).

Go 1.14 added **async preemption**: goroutines in tight loops are preempted by signals. This prevents one goroutine from starving others.

`goleak.VerifyNone(t)`: checks at test end that no goroutines were started and not stopped. Goroutine leaks accumulate over time and eventually exhaust memory. **Adding this to every test file catches leaks immediately.**

---

### Tuesday — Week 8 · Channels: Every Pattern You Need

| | |
|---|---|
| 🛠 **Technologies** | Go channels, `sync.WaitGroup` |
| 📖 **Concepts** | Buffered vs unbuffered channels, `close()` and ranging, direction constraints, pipeline pattern, fan-out, fan-in, semaphore via buffered channel |
| 🎯 **You Build** | Complete channel pattern library: pipeline, fan-out, fan-in, timeout, semaphore — all with race-free tests |
| 🔗 **Why It Matters** | Channels are Go's primary concurrency primitive. They communicate data AND synchronize goroutines. Misusing them causes deadlocks or goroutine leaks. |

**Each Channel Pattern**:

- **Unbuffered channel** — send blocks until a receiver is ready. Guarantees synchronization between sender and receiver.
- **Buffered channel** — send blocks only when the buffer is full. `make(chan struct{}, 10)` = max 10 concurrent operations (semaphore).
- **Pipeline** — chain of goroutines connected by channels. `close()` on a channel signals no more values — `range` over a channel reads until closed.
- **Fan-out** — distribute work across N goroutines, each reading from the same input channel.
- **Fan-in (merge)** — multiple channels → one channel. Use a `WaitGroup` to close the output when all inputs are closed.
- **`nil` channel** — blocks forever. Useful to disable a `select` case without restructuring the code.

---

### Wednesday — Week 8 · `sync` Package: Mutex, RWMutex, Pool, Once, Map

| | |
|---|---|
| 🛠 **Technologies** | Go `sync` package, `go test -bench` |
| 📖 **Concepts** | `Mutex` vs `RWMutex`, `sync.Pool` for GC pressure reduction, `sync.Once` for singleton initialization, sharded locks for reducing contention |
| 🎯 **You Build** | Concurrent LRU cache using `RWMutex`. Benchmark Mutex vs RWMutex at 90% reads. Shard the cache 16 ways for lower contention. |
| 🔗 **Why It Matters** | Lock contention is a primary cause of concurrency performance bottlenecks. Sharding reduces contention by 16x. |

- **`sync.Mutex`** — exclusive lock: only one goroutine at a time. Serializes all access.
- **`sync.RWMutex`** — multiple readers OR one writer. For read-heavy workloads (like a cache read 100x for every write), `RWMutex` allows all reads to proceed in parallel.
- **`sync.Pool`** — pool of reusable objects. `Get()` returns an object from the pool (or allocates a new one). `Put()` returns an object to the pool. Reduces allocation rate and GC pressure in hot paths.
- **`sync.Once`** — executes a function exactly once, safely across concurrent callers. Use for lazy singleton initialization.

**Sharded locks**: instead of one mutex for the entire cache, create 16 mutexes, each guarding 1/16th of the key space. Goroutines with different keys rarely contend — 16x improvement in throughput under concurrent load.

---

### Thursday — Week 8 · `context`, `errgroup`, `singleflight`

| | |
|---|---|
| 🛠 **Technologies** | Go `context` package, `golang.org/x/sync/errgroup`, `golang.org/x/sync/singleflight` |
| 📖 **Concepts** | Context propagation, `WithCancel`/`WithTimeout`/`WithDeadline`, request-scoped values, `errgroup` for parallel goroutines with error collection, `singleflight` for thundering herd prevention |
| 🎯 **You Build** | FleetPulse `getDriverContext` — runs zone lookup, surge pricing, and active driver count in parallel using `errgroup`, with `singleflight` deduplicating geocoding calls |
| 🔗 **Why It Matters** | Context is the backbone of Go cancellation. `singleflight` prevents 100 concurrent cache misses from generating 100 database queries. |

`context.Context` propagates cancellation, deadlines, and request-scoped values across goroutine boundaries. It is always the **first argument** to every function that does I/O. When a request is cancelled (client disconnected), context cancellation propagates to all goroutines serving that request.

`errgroup.WithContext`: launch N goroutines, and if any one fails, cancel the context for all others. Wait for all to finish. Return the first error encountered.

`singleflight`: if 100 goroutines call the same function with the same key simultaneously (all cache-miss on the same GPS coordinate), `singleflight` executes the function **ONCE** and shares the result with all 100 waiters. Instead of 100 database queries, you make 1.

---

### Friday — Week 8 · `atomic`, `pprof`, Race Detector Mastery

| | |
|---|---|
| 🛠 **Technologies** | Go `atomic` package, `go tool pprof`, `go test -race` |
| 📖 **Concepts** | Lock-free counters with `atomic.Int64`, Compare-And-Swap (CAS), `pprof` CPU/heap/goroutine profiles, flame graph reading, race detector internals |
| 🎯 **You Build** | Sharded LRU cache with atomic counters. `pprof` profile showing mutex contention before/after sharding. |
| 🔗 **Why It Matters** | The race detector finds data races that are intermittent and hard to reproduce in testing. Running `go test -race` is mandatory before every commit. |

---

## Week 9 — Go Stdlib Deep: `net/http`, `io`, `testing`, `sqlc`, `chi`

---

### Monday — Week 9 · `net/http`: Building a Production HTTP Server in Go

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http`, `chi` router |
| 📖 **Concepts** | `http.Handler` interface, middleware chain pattern, `ServeMux` with Go 1.22 pattern matching, server timeouts (read/write/idle/shutdown), `http.Transport` pooling |
| 🎯 **You Build** | FleetPulse zone API in Go: `chi` router, middleware chain (logging, auth, requestID), server with all timeouts set |
| 🔗 **Why It Matters** | Servers without timeouts will hang forever on slow clients. Missing middleware means missing observability. |

`http.Handler` is an interface with one method: `ServeHTTP(ResponseWriter, *Request)`. **Middleware** is a function that takes an `http.Handler` and returns an `http.Handler` — wrapping the original with additional behavior (logging, auth, tracing).

The middleware chain: `loggingMiddleware(authMiddleware(rateLimiter(handler)))`. Each middleware runs before and/or after the next.

**Server timeouts**: `ReadTimeout` (time to read request headers+body), `WriteTimeout` (time to write response), `IdleTimeout` (time to keep keep-alive connections open). Without these, a slow client or network issue can hold a connection open forever, eventually exhausting the server's file descriptors.

---

### Tuesday–Wednesday — Week 9 · `io`, `bufio`, `encoding/json`, `slog`

| | |
|---|---|
| 🛠 **Technologies** | Go `io`, `bufio`, `encoding/json` packages, `slog` (Go 1.21+) |
| 📖 **Concepts** | `io.Reader`/`Writer` composition, buffered I/O for performance, streaming JSON decoding, structured logging with context attributes |
| 🎯 **You Build** | File processing pipeline using `io.TeeReader` (fan out to two sinks) + `bufio.Scanner`. Structured logger with automatic `requestId`/`traceId`. |
| 🔗 **Why It Matters** | `io.Reader` and `io.Writer` are Go's most important interfaces. Anything that implements them composes freely — files, HTTP bodies, buffers, crypto hashers, compressors. |

`io.TeeReader(reader, writer)` reads from `reader` but simultaneously writes everything read to `writer`. `io.LimitReader` wraps a reader and stops after N bytes. This composition is how Go avoids the object hierarchy of Java's `InputStream` subclass explosion.

`slog` (Go 1.21): structured logging with key-value pairs. `slog.Info("request", "path", r.URL.Path, "duration", duration)` produces machine-parseable JSON logs. Every log line in production should be structured — it enables searching and alerting.

---

### Thursday — Week 9 · `sqlc` + `pgx/v5`: Type-Safe Database Queries

| | |
|---|---|
| 🛠 **Technologies** | `sqlc`, `pgx/v5`, `pgxpool` |
| 📖 **Concepts** | Code generation from SQL, compile-time query validation, `pgxpool` connection pooling, `CopyFrom` for bulk inserts, `pgx.Batch` for multi-query |
| 🎯 **You Build** | FleetPulse database layer using `sqlc`-generated types. Zero hand-written `rows.Scan` calls. |
| 🔗 **Why It Matters** | `sqlc` generates Go types from your SQL at compile time. Wrong column name? Compile error. Wrong type? Compile error. No runtime panics from mismatched scan targets. |

`sqlc` workflow: write SQL queries in `.sql` files with special comments → run `sqlc generate` → it produces Go functions that execute those exact queries and return properly typed structs. Compile-time SQL validation.

`pgxpool.Pool`: a connection pool for PostgreSQL. Without a pool, each request opens a new TCP connection — expensive (100ms+ on first connect). Pool size should be set based on PostgreSQL `max_connections` and expected concurrency.

`CopyFrom`: PostgreSQL bulk insert protocol. 10,000 rows with `CopyFrom` takes ~10ms. 10,000 rows with individual INSERTs takes ~10 seconds.

---

### Friday — Week 9 · `testing`, `pprof`, `go-redis`, `goleak` Mastery

| | |
|---|---|
| 🛠 **Technologies** | Go `testing` package, `testify`, `go-redis/v9`, `goleak` |
| 📖 **Concepts** | Table-driven tests, `t.Run` subtests, `go test -bench` benchmarks, Redis pipeline for batching, Lua scripts for atomicity |
| 🎯 **You Build** | Comprehensive test suite for all Go utilities. Redis rate limiter with Lua script for atomic check-and-increment. |
| 🔗 **Why It Matters** | Table-driven tests are idiomatic Go. Lua scripts in Redis execute atomically — no other command runs between your check and your increment. |

**Table-driven tests**: define a slice of test cases with inputs and expected outputs. Range over them with `t.Run`. Each case runs as an independent subtest. Adding a new test case is one line.

**Redis Lua scripts**: `EVAL 'script'` runs atomically. The Redis server executes the entire script without any other command interrupting it. This is how you implement check-then-set logic atomically — like checking a rate limit counter and incrementing it only if below the threshold.

---

## Week 10 — DungBeetle v0.1 Rewritten in Go + Go Tools Complete

---

### Monday–Wednesday — Week 10 · DungBeetle Rewrite: Go + PostgreSQL + Redis

| | |
|---|---|
| 🛠 **Technologies** | Go, `chi`, `sqlc`, `pgx`, `go-redis`, `cobra` CLI |
| 📖 **Concepts** | Clean architecture in Go (handler → service → repository), `cobra` CLI for `fleetctl`, graceful shutdown with context cancellation, structured error types |
| 🎯 **You Build** | DungBeetle v0.1 in pure Go — job queue with HTTP API, worker pool, status tracking, CLI |
| 🔗 **Why It Matters** | This is the first production-grade Go service. The architecture patterns here repeat in every subsequent Go project. |

**Clean architecture in Go**: Handler (receives HTTP request, calls Service, returns response) → Service (business logic, calls Repository) → Repository (SQL queries via `sqlc`). Each layer depends only on interfaces — making every layer independently testable with mock implementations.

**Graceful shutdown**: when SIGTERM is received (Kubernetes stopping the pod), the server stops accepting new requests, waits for in-flight requests to complete (with a timeout), then exits. Without this, requests in progress get cut off mid-execution — bad for payment operations and job processing.

**`cobra` CLI**: every production service needs operational commands. DungBeetle gets `fleetctl jobs list`, `fleetctl jobs retry`, `fleetctl workers status`. This follows the same pattern as `kubectl`, `docker`, `git`.

---

### Thursday–Friday — Week 10 · Benchmarking, Race Detection, `goleak` Final Checks

| | |
|---|---|
| 🛠 **Technologies** | `go test -bench`, `go test -race`, `goleak`, `pprof` |
| 📖 **Concepts** | Benchmark writing with `testing.B`, `b.ResetTimer`, `b.RunParallel`, CPU profile interpretation, mutex contention profiling |
| 🎯 **You Build** | `BENCHMARKS.md` documenting every data structure and algorithm with operations/second and memory allocation per op |
| 🔗 **Why It Matters** | You don't know your system's performance until you measure it. These benchmarks become the baseline that catches regressions in CI. |

### Weekend Capstone — Go Language Mastery Complete

Every Go utility has 100% test coverage. `go test -race` passes everywhere. `goleak.VerifyNone` passes everywhere. `BENCHMARKS.md` is written. DungBeetle v0.1 is deployed. This ends the Go language phase.

---

---

# MONTH 4 — React + Frameworks + Testing

> Now that you understand vanilla JavaScript deeply, React becomes obvious. You know what React abstracts because you did it by hand in Week 2.

---

## Week 13 — React Fundamentals From First Principles

---

### Monday — Week 13 · React: `UI = f(state)` + Reconciliation + All Core Hooks

| | |
|---|---|
| 🛠 **Technologies** | React 18, ReactDOM, React DevTools Profiler |
| 📖 **Concepts** | Virtual DOM, reconciliation algorithm, fiber architecture, `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`, `useContext`, `useReducer`, `React.memo` |
| 🎯 **You Build** | FleetPulse driver dashboard in React — replaces the vanilla JS version from Week 2 |
| 🔗 **Why It Matters** | Understanding React's reconciliation means you know when to use `useMemo`/`useCallback` and when they are premature optimization. |

React's core model: `UI = f(state)`. Given the same state, render always produces the same UI. When state changes, React calls your component again and diffs the new virtual DOM tree against the previous one (reconciliation). Only actual differences are applied to the real DOM.

- **`useState`** — local component state. Calling the setter schedules a re-render.
- **`useEffect`** — side effects after render: fetch data, subscribe to events, set timers. The cleanup function runs before the next effect and on unmount.
- **`useCallback`** — memoize a function so it keeps the same reference between renders. Only use when passing callbacks to memoized child components.
- **`useMemo`** — memoize an expensive computed value. Only use when the computation is genuinely expensive.
- **`useReducer`** — for complex state with multiple sub-values or when next state depends on previous state in non-trivial ways.
- **`React.memo`** — prevent a child component from re-rendering if its props have not changed (by reference equality).

---

### Tuesday — Week 13 · Tanstack Query: Data Fetching + Caching + Optimistic Updates

| | |
|---|---|
| 🛠 **Technologies** | Tanstack Query (React Query), Zod |
| 📖 **Concepts** | `staleTime` vs `gcTime`, background refetch, optimistic updates with rollback, query invalidation, mutation lifecycle |
| 🎯 **You Build** | RouteMaster order list with optimistic status updates — UI updates instantly, rolls back if API fails |
| 🔗 **Why It Matters** | Optimistic updates make UIs feel instant. Tanstack Query handles the complex rollback logic when the server rejects the update. |

`staleTime`: how long before a query result is considered stale and needs a background refresh. `gcTime`: how long an unused query stays in the cache before being garbage collected. Setting `staleTime` to `0` (default) means every mount triggers a background fetch. Setting it higher reduces network requests for data that changes rarely.

---

### Wednesday — Week 13 · Zustand + Immer: State Management

| | |
|---|---|
| 🛠 **Technologies** | Zustand, Immer.js, Tailwind CSS |
| 📖 **Concepts** | Store creation, selective subscription (component only re-renders when its slice changes), Immer structural sharing in stores, devtools middleware |
| 🎯 **You Build** | FleetPulse global driver state in Zustand — components subscribe to only the data they need |
| 🔗 **Why It Matters** | Zustand's selective subscription prevents the React Context re-render problem (every consumer re-renders on any context change). |

---

### Thursday — Week 13 · Next.js: Server Components, App Router, Server Actions

| | |
|---|---|
| 🛠 **Technologies** | Next.js 14 App Router, React Server Components |
| 📖 **Concepts** | Server Components (no JS sent to client), `'use client'` for interactivity, ISR, streaming Suspense, Server Actions replacing API routes |
| 🎯 **You Build** | RouteMaster customer-facing app in Next.js — public pages are Server Components, interactive order tracker is `'use client'` |
| 🔗 **Why It Matters** | Server Components render on the server and send HTML — zero JavaScript for static content. This is how you achieve Lighthouse 100 performance scores. |

---

### Friday — Week 13 · Svelte + SvelteKit and Vue 3 + Nuxt

| | |
|---|---|
| 🛠 **Technologies** | SvelteKit, Svelte compiler, Vue 3 Composition API, Nuxt, Pinia |
| 📖 **Concepts** | Compiler-based reactivity (no virtual DOM), reactive `$:` statements, Vue `reactive()`/`ref()`/`computed()`, Pinia stores, SSR with Nuxt |
| 🎯 **You Build** | FleetPulse driver widget in Svelte (14KB bundle — no runtime), AeroOps admin panel in Vue 3 + Nuxt |
| 🔗 **Why It Matters** | Svelte compiles reactivity to imperative DOM updates — no virtual DOM diffing. Vue and Nuxt are mainstream in enterprise Europe/Asia. Knowing all three makes you broadly employable. |

---

## Week 14 — Testing: Vitest, Playwright, Cypress, TestSprite

---

### Monday — Week 14 · Unit Testing: Vitest + React Testing Library

| | |
|---|---|
| 🛠 **Technologies** | Vitest, `@testing-library/react`, `vi.mock`, `vi.spyOn` |
| 📖 **Concepts** | `getByRole` (accessible queries), `user-event` for realistic interactions, module mocking, test isolation, 80%+ coverage on business logic |
| 🎯 **You Build** | Full test suite for all 4 platform frontends |
| 🔗 **Why It Matters** | Testing through the DOM (`getByRole`) tests behavior, not implementation. When you refactor, tests still pass if behavior is unchanged. |

---

### Tuesday–Wednesday — Week 14 · E2E Testing: Playwright

| | |
|---|---|
| 🛠 **Technologies** | Playwright, cross-browser (Chromium/Firefox/WebKit), network mocking |
| 📖 **Concepts** | Auto-wait (no flaky sleeps), page object model, network interception, screenshot comparison, CI integration |
| 🎯 **You Build** | Complete E2E test suites for all 4 platforms — covers critical user journeys (login, create order, track delivery) |
| 🔗 **Why It Matters** | Playwright tests run in real browsers. They catch visual regressions, JavaScript errors, network failures, and cross-browser bugs that unit tests cannot. |

---

### Thursday–Friday — Week 14 · Go Testing: Benchmarks, Race Detection, Table-Driven Tests at Scale

| | |
|---|---|
| 🛠 **Technologies** | Go `testing`, `testify/assert`, `go test -bench -race -coverprofile`, `testcontainers` |
| 📖 **Concepts** | `b.RunParallel` for concurrent benchmarks, `httptest.Server` for integration tests, `testcontainers` for real PostgreSQL/Redis in tests |
| 🎯 **You Build** | All DungBeetle and FleetPulse Go services at 80%+ test coverage with race detector passing |
| 🔗 **Why It Matters** | `testcontainers` spins up real PostgreSQL in Docker for tests. Tests against the real database catch SQL bugs that mocks miss. |

---

---

# MONTH 5 — Infrastructure + Real-Time + SideCar

---

### Monday — Week 17 · Docker Multi-Stage Builds + Docker Compose

| | |
|---|---|
| 🛠 **Technologies** | Docker, multi-stage `Dockerfile` |
| 📖 **Concepts** | Multi-stage builds (900MB → 85MB image), non-root user, health checks, Docker Compose for local dev |
| 🎯 **You Build** | All 9 project services containerized. Each service's Docker image is under 100MB. |
| 🔗 **Why It Matters** | Smaller images mean faster deployments, smaller attack surface, and less storage cost. Non-root containers are a basic security requirement. |

---

### Tuesday — Week 17 · Kubernetes: Deployments, Services, Ingress

| | |
|---|---|
| 🛠 **Technologies** | Kubernetes, `kubectl`, `kind` (local K8s) |
| 📖 **Concepts** | Pod, Deployment, Service, Ingress, ConfigMap, Secret, resource limits/requests, HPA (Horizontal Pod Autoscaler) |
| 🎯 **You Build** | All services deployed to local `kind` cluster. HPA configured to scale on CPU usage. |
| 🔗 **Why It Matters** | HPA is how production systems handle traffic spikes automatically — it scales pods when CPU exceeds a threshold, and scales down when traffic drops. |

---

### Wednesday — Week 17 · Terraform: Infrastructure as Code

| | |
|---|---|
| 🛠 **Technologies** | Terraform, AWS (ECS/RDS/ElastiCache/MSK) |
| 📖 **Concepts** | HCL syntax, state file (S3 + DynamoDB locking), `plan → apply` workflow, modules, variable files per environment |
| 🎯 **You Build** | Terraform configs for all infrastructure: VPC, ECS Fargate services, RDS Multi-AZ, ElastiCache Redis, MSK Kafka |
| 🔗 **Why It Matters** | Infrastructure as Code means your entire cloud setup is version-controlled, reviewable, and reproducible. No more clicking around the AWS console. |

---

### Thursday — Week 17 · Kafka: Topics, Partitions, Consumer Groups, Producer Guarantees

| | |
|---|---|
| 🛠 **Technologies** | Apache Kafka, MSK, Confluent Go client |
| 📖 **Concepts** | Topic partitioning strategy, partition key selection, consumer group rebalancing, idempotent producer, exactly-once semantics, offset management |
| 🎯 **You Build** | FleetPulse GPS events flowing through Kafka. DungBeetle consuming from a Kafka topic. |
| 🔗 **Why It Matters** | Kafka decouples producers from consumers, buffers traffic spikes, and enables replay. It is the backbone of every real-time data pipeline. |

---

### Friday — Week 17 · gRPC + Protobuf: Internal Service Communication

| | |
|---|---|
| 🛠 **Technologies** | gRPC, Protocol Buffers, `buf` CLI |
| 📖 **Concepts** | Proto3 syntax, service definitions, code generation, streaming RPCs (unary/server/client/bidirectional), gRPC vs REST tradeoffs |
| 🎯 **You Build** | PayCore internal services communicating over gRPC. Proto definitions in a shared `proto/` directory. |
| 🔗 **Why It Matters** | gRPC uses binary encoding (10x smaller than JSON) and enforces a schema contract. Streaming RPCs enable real-time bidirectional communication without WebSocket complexity. |

---

### Monday — Week 18 · SideCar v0.1: Reverse Proxy in Go

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http` reverse proxy, `httputil.ReverseProxy` |
| 📖 **Concepts** | `httputil.ReverseProxy`, `ModifyResponse` hook, request ID injection, header forwarding, basic circuit breaker |
| 🎯 **You Build** | SideCar proxy running in front of DungBeetle — intercepting all requests and responses |
| 🔗 **Why It Matters** | A sidecar proxy gives you observability, security, and resilience without changing any application code. This is how Istio and Envoy work. |

---

### Tuesday — Week 18 · OpenTelemetry: Distributed Tracing

| | |
|---|---|
| 🛠 **Technologies** | OpenTelemetry Go SDK, Jaeger, Prometheus |
| 📖 **Concepts** | Trace context propagation (W3C TraceContext), spans and attributes, metrics (Counter/Histogram/Gauge), Prometheus scraping |
| 🎯 **You Build** | Every service emitting traces to Jaeger. Latency histograms in Prometheus. End-to-end trace visible for a GPS ping through all services. |
| 🔗 **Why It Matters** | In a microservices system, a single request touches 5–10 services. Without distributed tracing, you cannot tell which service caused a latency spike. |

---

### Wednesday — Week 18 · WebSockets + SSE: Real-Time Data Push

| | |
|---|---|
| 🛠 **Technologies** | Go `gorilla/websocket`, HTML5 `EventSource` |
| 📖 **Concepts** | WebSocket upgrade handshake, ping/pong keep-alive, fan-out broadcast (all connections for a zone), SSE for one-way server push, connection registry in `sync.Map` |
| 🎯 **You Build** | FleetPulse real-time driver position updates pushed to browser via WebSocket. StreamDB analytics dashboard using SSE. |
| 🔗 **Why It Matters** | HTTP polling creates unnecessary load. WebSockets and SSE push data to clients the instant it changes. |

---

### Thursday–Friday — Week 18 · SideCar v1.0: Circuit Breaker + mTLS + Rate Limiter

| | |
|---|---|
| 🛠 **Technologies** | Go, x509 certificates, token bucket |
| 📖 **Concepts** | Circuit breaker states (closed/open/half-open), exponential backoff for recovery, mTLS certificate rotation, token bucket rate limiting |
| 🎯 **You Build** | SideCar deployed in front of all services. Circuit breaker protecting PayCore from downstream failures. |
| 🔗 **Why It Matters** | A circuit breaker prevents a slow downstream service from causing a cascade failure across your entire system — it trips after N failures and short-circuits requests until the downstream recovers. |

---

---

# MONTH 6 — PayCore: Financial Systems

---

### Week 21 · Double-Entry Ledger

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, transactions, `DECIMAL(19,4)` |
| 📖 **Concepts** | Double-entry bookkeeping, journal entries, trial balance constraint, ACID transactions for financial operations |
| 🎯 **You Build** | PayCore ledger: every financial movement creates two entries (debit + credit) that always sum to zero |
| 🔗 **Why It Matters** | This is how every bank, payment processor, and accounting system stores money. A corrupted ledger is a compliance failure. |

---

### Week 22 · Idempotency Keys + Outbox Pattern

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, Kafka, Redis |
| 📖 **Concepts** | Idempotency: same request processed twice = same result (not two charges). Outbox pattern: write Kafka event in the same DB transaction as the business operation. |
| 🎯 **You Build** | PayCore payment endpoint: zero double-charges verified by test. Outbox worker reliably publishing events. |
| 🔗 **Why It Matters** | Without idempotency, a network retry causes a duplicate charge. Without the outbox pattern, you can write to the DB but crash before publishing to Kafka — losing the event forever. |

---

### Week 23 · Saga Pattern: Distributed Transactions

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL |
| 📖 **Concepts** | Saga: sequence of local transactions with compensating transactions for rollback. Choreography vs orchestration. |
| 🎯 **You Build** | Fund transfer saga: debit source → credit destination → confirm. Each step has a compensating operation if a later step fails. |
| 🔗 **Why It Matters** | Distributed ACID transactions across services are nearly impossible. Sagas give you eventual consistency with explicit compensation — the industry standard. |

---

### Week 24 · Event Sourcing + CQRS

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL, read models |
| 📖 **Concepts** | Event Sourcing: store state changes as immutable events. CQRS: separate read models from write models. Projections rebuild read models from events. |
| 🎯 **You Build** | PayCore v2.0: event-sourced ledger. Read model rebuilt from Kafka events. Historical state reconstructed by replaying events. |
| 🔗 **Why It Matters** | Event sourcing gives you a complete audit trail and the ability to replay history — invaluable for financial systems and debugging. |

---

---

# MONTH 7 — StreamDB: Real-Time Analytics

---

### Week 25 · TimescaleDB: Time-Series Storage

| | |
|---|---|
| 🛠 **Technologies** | TimescaleDB, PostgreSQL hypertables |
| 📖 **Concepts** | Hypertables with automatic time-based partitioning, partition pruning, continuous aggregates, retention policies |
| 🎯 **You Build** | StreamDB ingesting GPS pings into TimescaleDB. Time-range queries use partition pruning — only touching recent partitions, not the entire table. |
| 🔗 **Why It Matters** | A `WHERE time > NOW() - INTERVAL '5 minutes'` query on a 1-billion-row GPS table without TimescaleDB = full table scan. With hypertables = only the last partition. 1000x faster. |

---

### Week 26 · Kafka Streams: Stateful Processing

| | |
|---|---|
| 🛠 **Technologies** | Kafka Streams, Go Kafka client |
| 📖 **Concepts** | Stateful stream processing, aggregations, tumbling windows, sliding windows, exactly-once processing semantics |
| 🎯 **You Build** | Count GPS pings per driver per minute using tumbling windows. Detect surge pricing triggers using sliding windows over driver density. |
| 🔗 **Why It Matters** | Tumbling windows aggregate events in fixed non-overlapping buckets. Sliding windows aggregate over a moving time range. These are the building blocks of every real-time analytics system. |

---

### Week 27 · Bloom Filters + HyperLogLog

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis |
| 📖 **Concepts** | Bloom filter: probabilistic set membership in O(1) with fixed memory. HyperLogLog: estimate unique count with 1% error using 12KB regardless of input size. |
| 🎯 **You Build** | Bloom filter to avoid cache lookups for keys that definitely do not exist. HyperLogLog to count unique active drivers per zone. |
| 🔗 **Why It Matters** | A Bloom filter avoids database lookups for keys that definitely do not exist — a huge reduction in wasted queries. HyperLogLog counts unique visitors with 1% error using 12KB instead of gigabytes of exact tracking. |

---

### Week 28 · Consistent Hashing + Case Studies 1–6

| | |
|---|---|
| 🛠 **Technologies** | Go |
| 📖 **Concepts** | Consistent hashing, virtual nodes (vnodes) for even key distribution, adding/removing nodes without full rehash |
| 🎯 **You Build** | Ring-based consistent hash with virtual nodes. Adding a node remaps only ~1/N keys, not all keys. |
| 🔗 **Why It Matters** | Consistent hashing is used in Redis Cluster, Cassandra, Memcached, and every distributed cache. Without it, adding one server would require rehashing every key to a new server. |

---

---

# MONTH 8 — KVault: Build Redis from Scratch

---

### Week 29 · RESP3 Protocol Parser

| | |
|---|---|
| 🛠 **Technologies** | Go `net` package, raw TCP |
| 📖 **Concepts** | Redis's wire protocol: arrays, bulk strings, integers, errors parsed from raw TCP bytes |
| 🎯 **You Build** | KVault speaks real Redis — any Redis client library can connect to it |
| 🔗 **Why It Matters** | Implementing a binary protocol teaches you exactly how Redis clients and servers communicate, making you a better debugger of Redis issues in production. |

---

### Week 30 · LRU + LFU Eviction

| | |
|---|---|
| 🛠 **Technologies** | Go, doubly-linked list, min-heap |
| 📖 **Concepts** | LRU (Least Recently Used): evict the key accessed longest ago — O(1) with doubly-linked list + HashMap. LFU (Least Frequently Used): evict the key accessed fewest times — O(log N) with min-heap. |
| 🎯 **You Build** | KVault with configurable eviction policy — `maxmemory-policy lru` or `lfu` |
| 🔗 **Why It Matters** | These are the same eviction algorithms Redis uses. Understanding them lets you tune Redis memory usage correctly in production. |

---

### Week 31 · AOF + Snapshotting: Persistence

| | |
|---|---|
| 🛠 **Technologies** | Go, `bufio`, `fsync` |
| 📖 **Concepts** | AOF (Append-Only File): every write command appended to a log file, replayed on restart. Snapshotting: serialize entire keyspace periodically. AOF = better durability. Snapshots = faster startup. |
| 🎯 **You Build** | KVault with configurable persistence: AOF with configurable fsync strategy, periodic snapshots with atomic rename |
| 🔗 **Why It Matters** | This is the exact durability mechanism Redis uses. Understanding it means you can reason about RPO (Recovery Point Objective) for any Redis deployment. |

---

### Week 32 · LSM-Tree Basics + Case Studies 7–11

| | |
|---|---|
| 🛠 **Technologies** | Go |
| 📖 **Concepts** | LSM-tree (Log-Structured Merge-tree): writes go to in-memory memtable → flushed to sorted immutable SSTables → background compaction merges SSTables |
| 🎯 **You Build** | Basic LSM-tree prototype: write to memtable, flush to SSTable on size threshold, compaction merging two SSTables |
| 🔗 **Why It Matters** | LSM-tree is the write path of RocksDB, LevelDB, Cassandra, DynamoDB, and many modern databases. Write performance is O(1) regardless of dataset size — writes go to memory first. |

---

---

# MONTH 9 — AI Engineering: OpsAI + Multi-Agent Systems

---

### Week 33 · Vector Embeddings + PGVector

| | |
|---|---|
| 🛠 **Technologies** | OpenAI embeddings API, `pgvector`, PostgreSQL |
| 📖 **Concepts** | Embeddings as semantic representations, cosine similarity, HNSW index for approximate nearest-neighbor search, hybrid BM25 + vector search |
| 🎯 **You Build** | OpsAI semantic search: "find maintenance procedures similar to this failure description" returns relevant procedures using vector similarity |
| 🔗 **Why It Matters** | Keyword search fails when the exact words are different. Vector search finds semantically similar content — the same concept expressed differently. |

An embedding is a fixed-size vector (array of floats) representing semantic meaning. Similar sentences have similar vectors (high cosine similarity). HNSW (Hierarchical Navigable Small World) is an index structure for finding approximate nearest neighbors in milliseconds across millions of vectors.

---

### Week 34 · RAG: Retrieval-Augmented Generation

| | |
|---|---|
| 🛠 **Technologies** | Go, `pgvector`, OpenAI API |
| 📖 **Concepts** | RAG pipeline: embed query → retrieve top-K similar chunks → inject into LLM context → generate answer grounded in your data |
| 🎯 **You Build** | AeroOps maintenance assistant: answers questions about aircraft maintenance using actual maintenance manuals as the knowledge base |
| 🔗 **Why It Matters** | Without RAG, an LLM can only answer questions from its training data (outdated, general). With RAG, it answers from your actual documents — current, specific, auditable. |

---

### Week 35 · Tool Use + Function Calling

| | |
|---|---|
| 🛠 **Technologies** | OpenAI function calling, Go |
| 📖 **Concepts** | Tool definitions, the LLM choosing which tool to call and with what arguments, your code executing the tool, returning results to the LLM |
| 🎯 **You Build** | OpsAI with tools: query_database, get_driver_status, check_kafka_lag, create_alert — the LLM orchestrates all of these |
| 🔗 **Why It Matters** | Tool use is how AI agents interact with real systems. The LLM decides what to do; your code executes it safely. |

---

### Week 36 · Multi-Agent Orchestration

| | |
|---|---|
| 🛠 **Technologies** | Go, DungBeetle job system |
| 📖 **Concepts** | Multi-agent: coordinator agent breaks complex task into subtasks, delegates to specialist agents, aggregates results. Each agent has different tools and context. |
| 🎯 **You Build** | OpsAI multi-agent system running on DungBeetle: coordinator → anomaly detector agent + root cause agent + remediation agent |
| 🔗 **Why It Matters** | No single LLM context window is large enough for complex investigations. Multi-agent systems parallelize work and use specialist agents for each subtask. |

---

---

# MONTHS 10–11 — Performance + Polish + Hiring Sprint

> This phase is not about learning new technologies. It is about making everything you built production-worthy and presenting it compellingly.

---

**k6 Load Testing** — Every service gets a k6 load test. p50/p95/p99 latency at target RPS is documented. This is proof that your systems work under production-level load, not just in unit tests.

**pprof and `go test -bench`** — Every Go service is profiled. Every data structure has a benchmark. If a benchmark regresses, CI fails. You know the performance characteristics of your own code.

**`EXPLAIN ANALYZE` on Every Query** — Every SQL query has been inspected. Sequential scans on large tables are eliminated. Index coverage is verified.

**Lighthouse 100/100/100/100** — All 4 frontend platforms score 100 in Performance, Accessibility, Best Practices, SEO. Set in Week 1, maintained throughout.

**PITR Drill** — Point-In-Time Recovery drill: `DROP TABLE` on a production-like database, restore to 30 seconds before the drop, document Recovery Time Objective (RTO < 10 minutes).

**Architecture Decision Records** — Every major technology choice has a one-page ADR. Future engineers can understand why PostgreSQL was chosen over MongoDB for this service, why Kafka instead of RabbitMQ.

**`go test -race ./...` passes** — No data races anywhere. This is the most important correctness guarantee in the codebase.

**`tsc --noEmit` passes** — No `any`, no suppressed TypeScript errors. The type system is fully intact.

**Portfolio and Cold Outreach** — 3 polished projects with live demos, benchmark numbers in READMEs, Mermaid architecture diagrams. Cold email template with specific achievement numbers: 1M GPS pings/sec, 0 double charges, p99 < 15ms fraud detection.

---

## Non-Negotiable Rules (Apply From Day 1)

| Rule | Why |
|------|-----|
| `go test -race ./...` passes before every commit | Data races are silent production bugs |
| `tsc --noEmit` passes — no `any` | TypeScript `any` silently disables all type checking |
| Lighthouse 100/100/100/100 | Set Week 1, maintained all 10 months |
| `EXPLAIN ANALYZE` on every SQL query | Blind queries become production outages |
| Idempotency key on every mutation that could be retried | Duplicate operations corrupt data |
| Outbox pattern for every Kafka publish that must be guaranteed | Events lost at publish time = data inconsistency |
| ADR for every major technology decision | Future you needs to know why |
| k6 load test before calling anything "production-ready" | Untested performance claims are fiction |
| `X/Twitter post` every weekend | Building in public accelerates learning |
