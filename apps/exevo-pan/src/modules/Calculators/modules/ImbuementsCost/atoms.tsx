import { Tabs, Input as BaseInput } from 'components/Atoms'
import { numberWithCommaSeparator } from 'utils'
import { InputProps } from 'components/Atoms/Input/types'

export const LabelWrapper = (args: JSX.IntrinsicElements['div']) => (
  <div className="flex items-center gap-1" {...args} />
)

export const Panel: typeof Tabs.Panel = (args) => (
  <Tabs.Panel className="grid gap-4 px-3 pt-2" {...args} />
)

export const Input = (args: Omit<InputProps, 'ref'>) => (
  <BaseInput
    inputMode="numeric"
    placeholder="GP value"
    noAlert
    mask={numberWithCommaSeparator}
    {...args}
  />
)
