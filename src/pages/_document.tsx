import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="ja-JP">
        <Head>
          <link
            rel="apple-touch-icon"
            type="image/png"
            href="/apple-touch-icon-180x180.png"
          />
          <link rel="icon" type="image/png" href="/icon-192x192.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icon-32x32.png"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
