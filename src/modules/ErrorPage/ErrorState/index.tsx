import Link from 'next/link'
import { routes } from 'Constants'
import * as S from './styles'
import { ErrorStateProps } from './types'

const ErrorState = ({ title, paragraphs }: ErrorStateProps): JSX.Element => (
  <S.Wrapper>
    <S.Top>
      <S.Title>{title}</S.Title>
    </S.Top>
    <S.Bottom>
      <S.ErrorIcon
        role="alert"
        aria-label="Error, something unexpected happened"
      />
      {paragraphs?.map((p) => (
        <S.Paragraph key={p}>{p}</S.Paragraph>
      ))}

      <S.Nav>
        <S.Ul>
          <S.Li>
            <Link href={routes.HOME}>
              <S.A>Current Auctions</S.A>
            </Link>
          </S.Li>
          <S.Li>
            <Link href={routes.BAZAAR_HISTORY}>
              <S.A>Bazaar History</S.A>
            </Link>
          </S.Li>
          <S.Li>
            <Link href={routes.LIBERTABRA_WAR}>
              <S.A>Libertabra War</S.A>
            </Link>
          </S.Li>
          <S.Li>
            <Link href={routes.STATISTICS}>
              <S.A>Statistics</S.A>
            </Link>
          </S.Li>
        </S.Ul>
      </S.Nav>
    </S.Bottom>
  </S.Wrapper>
)

export default ErrorState
