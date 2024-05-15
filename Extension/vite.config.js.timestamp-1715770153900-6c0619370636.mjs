// vite.config.js
import { defineConfig } from "file:///C:/Users/andri/Documents/GitHub/Angel/Extension/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/andri/Documents/GitHub/Angel/Extension/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///C:/Users/andri/Documents/GitHub/Angel/Extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// public/manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Request Blocker",
  version: "1.0",
  permissions: [
    "declarativeNetRequest",
    "declarativeNetRequestWithHostAccess",
    "declarativeNetRequestFeedback",
    "storage"
  ],
  background: {
    service_worker: "src/background.js"
  },
  host_permissions: [
    "*://*/*"
  ],
  action: {
    default_popup: "index.html"
  },
  declarative_net_request: {
    rule_resources: [
      {
        id: "ruleset_1",
        enabled: true,
        path: "rules.json"
      }
    ]
  }
};

// vite.config.js
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default })],
  build: {
    rollupOptions: {
      input: {
        background: "src/background.js",
        popup: "index.html"
        // Ensure this matches your popup HTML
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicHVibGljL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbmRyaVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXEFuZ2VsXFxcXEV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW5kcmlcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxBbmdlbFxcXFxFeHRlbnNpb25cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FuZHJpL0RvY3VtZW50cy9HaXRIdWIvQW5nZWwvRXh0ZW5zaW9uL3ZpdGUuY29uZmlnLmpzXCI7Ly8gdml0ZS5jb25maWcuanNcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJztcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL3B1YmxpYy9tYW5pZmVzdC5qc29uJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnc3JjL2JhY2tncm91bmQuanMnLFxuICAgICAgICBwb3B1cDogJ2luZGV4Lmh0bWwnIC8vIEVuc3VyZSB0aGlzIG1hdGNoZXMgeW91ciBwb3B1cCBIVE1MXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdbbmFtZV0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ1tuYW1lXS5bZXh0XSdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwgIntcclxuICAgIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxyXG4gICAgXCJuYW1lXCI6IFwiUmVxdWVzdCBCbG9ja2VyXCIsXHJcbiAgICBcInZlcnNpb25cIjogXCIxLjBcIixcclxuICAgIFwicGVybWlzc2lvbnNcIjogW1xyXG4gICAgICAgIFwiZGVjbGFyYXRpdmVOZXRSZXF1ZXN0XCIsXHJcbiAgICAgICAgXCJkZWNsYXJhdGl2ZU5ldFJlcXVlc3RXaXRoSG9zdEFjY2Vzc1wiLFxyXG4gICAgICAgIFwiZGVjbGFyYXRpdmVOZXRSZXF1ZXN0RmVlZGJhY2tcIixcclxuICAgICAgICBcInN0b3JhZ2VcIlxyXG4gICAgXSxcclxuICAgIFwiYmFja2dyb3VuZFwiOiB7XHJcbiAgICAgICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kLmpzXCJcclxuICAgIH0sXHJcbiAgICBcImhvc3RfcGVybWlzc2lvbnNcIjogW1xyXG4gICAgICAgIFwiKjovLyovKlwiXHJcbiAgICBdLFxyXG4gICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcImluZGV4Lmh0bWxcIlxyXG4gICAgfSxcclxuICAgIFwiZGVjbGFyYXRpdmVfbmV0X3JlcXVlc3RcIjoge1xyXG4gICAgICAgIFwicnVsZV9yZXNvdXJjZXNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IFwicnVsZXNldF8xXCIsXHJcbiAgICAgICAgICAgICAgICBcImVuYWJsZWRcIjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcInJ1bGVzLmpzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLFdBQVc7OztBQ0pwQjtBQUFBLEVBQ0ksa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDVixnQkFBa0I7QUFBQSxFQUN0QjtBQUFBLEVBQ0Esa0JBQW9CO0FBQUEsSUFDaEI7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFVO0FBQUEsSUFDTixlQUFpQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQSx5QkFBMkI7QUFBQSxJQUN2QixnQkFBa0I7QUFBQSxNQUNkO0FBQUEsUUFDSSxJQUFNO0FBQUEsUUFDTixTQUFXO0FBQUEsUUFDWCxNQUFRO0FBQUEsTUFDWjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7OztBRHJCQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSwyQkFBUyxDQUFDLENBQUM7QUFBQSxFQUNwQyxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxZQUFZO0FBQUEsUUFDWixPQUFPO0FBQUE7QUFBQSxNQUNUO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
