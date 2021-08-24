import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { Main } from 'templates'
import ErrorPage from 'modules/ErrorPage'
import { GetStaticProps } from 'next'

export default function Custom404(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Exevo Pan - 404</title>
        <meta name="title" content="Exevo Pan - 404" />
        <meta property="og:site_name" content="Exevo Pan - 404" />
        <meta property="og:title" content="Exevo Pan - 404" />
        <meta property="twitter:title" content="Exevo Pan - 404" />
      </Head>

      <Main>
        <ErrorPage />
      </Main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common'])),
  },
})
