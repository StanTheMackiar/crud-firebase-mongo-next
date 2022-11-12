import Document, { DocumentContext, Html, Head, Main, NextScript, DocumentInitialProps } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(
      ctx: DocumentContext
    ): Promise<DocumentInitialProps> {
      const initialProps = await Document.getInitialProps(ctx)
  
      return initialProps
    }

    render() {
        return (
            <Html>
                <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument