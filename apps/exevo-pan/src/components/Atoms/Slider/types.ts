export type ExtendedProps = Omit<
  JSX.IntrinsicElements['input'],
  'aria-label' | 'ref'
>

export type Mark = { value: number; label: string | number }

export type Range = [number, number]

export type TransformFunction = (value: number) => string | number

export type LabelProps =
  | {
      label: string
      'aria-label'?: never
    }
  | {
      label: JSX.Element
      'aria-label': string
    }

export type CustomProps = {
  min: number
  max: number
  step?: number
  displayValue?: boolean
  showInput?: boolean
  transformDisplayedValues?: TransformFunction
  marks?: boolean | Mark[]
  disabled?: boolean
}

export type SliderProps = CustomProps & ExtendedProps & LabelProps
