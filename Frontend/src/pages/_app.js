// pages/_app.js
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRzF6gEwP7N9FTlHpOZyzklm8mJR1m4xM2H9g6FEb"
          crossOrigin="anonymous"
        />
        {/* Avoid Bootstrap JS during SSR */}
        {typeof window !== 'undefined' && (
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-w76A3mCCE8VeAUgnE7RIe6E4zEmY5f7xsoQbhgLvrjIEoUD9p2ImwM8f1WPGmxKz"
            crossOrigin="anonymous"
          ></script>
        )}
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
