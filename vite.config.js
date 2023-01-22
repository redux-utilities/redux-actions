import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js']
  },
  build: {
    lib: {
      formats: ['es'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ReduxActions',
      // the proper extensions will be added
      fileName: 'redux-actions'
    }
  }
});
