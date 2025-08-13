import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

async function loadRoutes(directory, basePath = "/") {
  const files = fs.readdirSync(directory);
  const isEndpointFolder = files.some(
    (file) => file.endsWith(".js") && !file.startsWith("_")
  );

  if (isEndpointFolder) {
    const endpointRouter = express.Router();

    for (const file of files) {
      if (file.endsWith(".js")) {
        const modulePath = path.join(directory, file);
        const handlerModule = await import(`file://${modulePath}`);
        const handler = handlerModule.default;

        let fullRoute = basePath;

        // If it's index.js, mount at the folder path
        if (file === "index.js") {
          const parentPath = path.dirname(basePath);
          const parentName = path.basename(parentPath);
          if (parentName) {
            fullRoute = basePath;
          }
        }

        // Handle dynamic params ([id].js => :id)
        const routeWithParams = fullRoute.replace(/\[(.*?)\]/g, ":$1");

        if (handler) {
          if (typeof handler === "function" && handler.use) {
            // 🚀 Express Router instance
            console.log(`Mounting router at ${routeWithParams}`);
            endpointRouter.use("/", handler);
          } else {
            // 🚀 Handler object { get, post, ... }
            Object.entries(handler).forEach(([method, fn]) => {
              if (["get", "post", "put", "delete", "patch"].includes(method.toLowerCase())) {
                console.log(`Registering [${method.toUpperCase()}] ${routeWithParams}`);
                endpointRouter[method.toLowerCase()](routeWithParams, fn);
              }
            });
          }
        }
      }
    }

    router.use(basePath, endpointRouter);
  } else {
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await loadRoutes(fullPath, basePath + file + "/");
      }
    }
  }
}

export const initRoutes = async function (app) {
  const routesDir = path.join(__dirname);
  await loadRoutes(routesDir);
  app.use("/", router);
};
