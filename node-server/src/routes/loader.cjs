import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Helper function to recursively load routes
function loadRoutes(directory, basePath = "/") {
  const files = fs.readdirSync(directory);
  const isEndpointFolder = files.some(
    (file) => file.endsWith(".js") && !file.includes("_")
  );

  // If this is an endpoint folder (contains .js files without _ prefix)
  if (isEndpointFolder) {
    // Create a router for this endpoint
    const endpointRouter = express.Router();

    // Load all handlers from this folder
    files.forEach((file) => {
      if (file.endsWith(".js")) {
        const handler = require(path.join(directory, file)).default;
        if (handler) {
          // The filename (without extension) becomes the endpoint name
          const endpointName = file.replace(".js", "");
          const fullRoute = basePath;

          // If it's an index file, use the parent folder name as route
          if (file === "index.js") {
            const parentPath = path.dirname(basePath);
            const parentName = path.basename(parentPath);
            if (parentName) {
              fullRoute = parentPath;
            }
          }

          // Handle dynamic parameters (e.g., :id)
          const routeWithParams = fullRoute
            .replace(/\[(.*?)\]/g, ":$1")
            .replace(/\[(.*?)\]/g, ":$1");

          // Register all methods in the handler
          Object.entries(handler).forEach(([method, handlerFn]) => {
            if (
              ["get", "post", "put", "delete", "patch"].includes(
                method.toLowerCase()
              )
            ) {
              endpointRouter[method.toLowerCase()](routeWithParams, handlerFn);
            }
          });
        }
      }
    });

    // Use this router at the current path
    router.use(basePath, endpointRouter);
  } else {
    // If it's a regular folder, create a nested route
    const subRouter = express.Router();
    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      const routePath = basePath + file;

      if (stat.isDirectory()) {
        loadRoutes(fullPath, routePath + "/");
      }
    });
    router.use(basePath, subRouter);
  }
}

// Export a function to initialize routes
module.exports.initRoutes = function (app) {
  const routesDir = path.join(__dirname);
  loadRoutes(routesDir);
  app.use("/", router);
}
// export default router;


