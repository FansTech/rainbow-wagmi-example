import Document, { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
    return (
            <Html>
                <Head>
                    <script src="https://telegram.org/js/telegram-web-app.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
};