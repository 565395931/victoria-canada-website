const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.join(__dirname, "public");
const port = Number(process.env.PORT) || 4173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml; charset=utf-8"
};
const compressible = new Set([".html", ".css", ".js", ".json", ".svg"]);
const spaRoutes = new Set(["/products", "/canadian-buyers", "/chinese-manufacturers", "/about", "/market-insights", "/request"]);

http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const normalizedRoute = requestPath.length > 1 ? requestPath.replace(/\/$/, "") : requestPath;
  const relativePath = requestPath === "/" || spaRoutes.has(normalizedRoute) ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  const pathFromRoot = path.relative(root, filePath);

  if (pathFromRoot.startsWith("..") || path.isAbsolute(pathFromRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const headers = {
      "Content-Type": types[extension] || "application/octet-stream",
      "Cache-Control": "no-cache"
    };
    const acceptedEncoding = request.headers["accept-encoding"] || "";

    const send = (body, encoding) => {
      if (encoding) {
        headers["Content-Encoding"] = encoding;
        headers.Vary = "Accept-Encoding";
      }
      headers["Content-Length"] = body.length;
      response.writeHead(200, headers);
      response.end(body);
    };

    if (!compressible.has(extension)) {
      send(data);
      return;
    }

    if (/\bbr\b/.test(acceptedEncoding)) {
      zlib.brotliCompress(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }, (compressionError, result) => {
        if (compressionError) send(data);
        else send(result, "br");
      });
      return;
    }

    if (/\bgzip\b/.test(acceptedEncoding)) {
      zlib.gzip(data, { level: 6 }, (compressionError, result) => {
        if (compressionError) send(data);
        else send(result, "gzip");
      });
      return;
    }

    send(data);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`VICTORIA prototype: http://127.0.0.1:${port}`);
});
