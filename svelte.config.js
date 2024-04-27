import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const filePath = dirname(fileURLToPath(import.meta.url))

const sassPath = `${filePath}/src/styles/`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess({
    scss: {
      prependData: `@import '${sassPath}global.scss';`
    }
  }),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},
  onwarn: (warning, handler) => {
    if (warning.code === 'css-unused-selector') return
    handler(warning)
  }
};

export default config;
