const nativeFetch = window.fetch.bind(window);

window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input?.url || "";
  if (!url.includes("exercises-addon-2.2.json")) return nativeFetch(input, init);

  const [previousResponse, currentResponse] = await Promise.all([
    nativeFetch(input, init),
    nativeFetch("exercises-addon-2.3.json?v=2.3.0", { cache: "no-store" })
  ]);

  if (!currentResponse.ok) return previousResponse;

  const previous = previousResponse.ok ? await previousResponse.json() : { exercises: [] };
  const current = await currentResponse.json();
  const byId = new Map([...(previous.exercises || []), ...(current.exercises || [])].map(item => [item.id, item]));

  return new Response(JSON.stringify({
    ...previous,
    version: "2.3.0",
    updatedAt: "2026-08-13",
    exercises: [...byId.values()]
  }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
};

await import("./app.js?v=2.3.0");
