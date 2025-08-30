// File Location: /pages/_app.js

// Import global styles.
// Make sure to set up Tailwind CSS by creating a tailwind.config.js and postcss.config.js
// and adding the necessary directives to a global CSS file.

// Using the "@/styles" alias defined in tsconfig.json to ensure correct path resolution.
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

