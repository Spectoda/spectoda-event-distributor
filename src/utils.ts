const debug = require("debug")("utils");

export async function emitEvent(event) {
  const url = "http://localhost:8888/event";
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(event),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    debug("response %o", data);
  } catch (error) {
    debug("error %o", error);
  }
}
