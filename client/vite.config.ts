import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/auth': 'http://localhost:3000',
//       '/listings': 'http://localhost:3000',
//       '/users': 'http://localhost:3000',
//       '/docs': 'http://localhost:3000',
//     },
//   },
// });
