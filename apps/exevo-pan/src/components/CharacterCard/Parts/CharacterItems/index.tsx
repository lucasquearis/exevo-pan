import { useTranslations } from 'contexts/useTranslation'
import { v4 as uuidv4 } from 'uuid'
import { SpritePortrait } from 'components/Atoms'
import { Background } from 'components/Atoms/SpritePortrait/styles'
import * as S from './styles'
import { CharacterItemsProps } from './types'

const fillItems = (amount: number) =>
  Array.from({ length: amount }, () => <Background key={uuidv4()} />)

const CharacterItems = ({
  items,
  ...props
}: CharacterItemsProps): JSX.Element => {
  const {
    translations: { common },
  } = useTranslations()

  return (
    <S.ItemWrapper {...props}>
      {items.map((floatItem) => {
        const [item, tier] = floatItem.toString().split('.')
        if (tier) {
          return (
            <S.SpriteWrapper key={uuidv4()}>
              <SpritePortrait
                alt={common.CharacterCard.featuredItem}
                src={`https://static.tibia.com/images/charactertrade/objects/${item}.gif`}
                width={32}
                height={32}
              />
              <S.ActiveCount title={`tier ${tier}`}>{tier}</S.ActiveCount>
            </S.SpriteWrapper>
          )
        }
        return (
          <SpritePortrait
            key={uuidv4()}
            alt={common.CharacterCard.featuredItem}
            src={`https://static.tibia.com/images/charactertrade/objects/${item}.gif`}
            width={32}
            height={32}
          />
        )
      })}
      {fillItems(4 - items.length)}
    </S.ItemWrapper>
  )
}

export default CharacterItems