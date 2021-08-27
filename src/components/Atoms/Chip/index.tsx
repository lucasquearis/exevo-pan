import { useTranslation } from 'next-i18next'
import { useState, memo } from 'react'
import { checkKeyboardTrigger } from 'utils'
import { ChipProps } from './types'
import * as S from './styles'

const ChipComponent = ({
  children,
  onClick,
  onClose,
  overrideStatus,
  ...props
}: ChipProps) => {
  const { t } = useTranslation('common')

  const [active, setActive] = useState<boolean>(false)
  const derivedActive = overrideStatus ?? active

  const handleClick = (event?: React.MouseEvent) => {
    if (onClick) {
      setActive((prev) => !prev)
      onClick(event)
    }
  }

  const handleKeypress = (event: React.KeyboardEvent) => {
    if (!!onClick && checkKeyboardTrigger(event.code)) {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <S.Chip
      active={derivedActive}
      clickable={!!onClick}
      role={onClick ? 'switch' : undefined}
      aria-checked={onClick ? derivedActive : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleClick}
      onKeyPress={handleKeypress}
      {...props}
    >
      {children}
      {!!onClose && (
        <S.CloseButton aria-label={t('RemoveItem')} onClick={onClose} />
      )}
    </S.Chip>
  )
}

const Chip = memo(ChipComponent)

export default Chip
