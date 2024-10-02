import { z } from 'zod'
import {
  T_IO_PROPS,
  T_IO_RETURNS,
  labelValue,
  primitiveValue,
} from '../ioSchema.js'
import Logger from '../classes/Logger.js'

type SelectMultipleProps<
  Option extends z.infer<typeof labelValue> | z.infer<typeof primitiveValue>
> = Omit<T_IO_PROPS<'SELECT_MULTIPLE'>, 'options' | 'defaultValue'> & {
  options: Option[]
  defaultValue?: Option[]
}

export default function selectMultiple(logger: Logger) {
  return <
    Option extends z.infer<typeof labelValue> | z.infer<typeof primitiveValue>
  >(
    props: SelectMultipleProps<Option>
  ) => {
    function normalizeOption(option: Option) {
      if (
        typeof option === 'string' ||
        typeof option === 'number' ||
        typeof option === 'boolean' ||
        option instanceof Date
      ) {
        return {
          label: option,
          value: option,
        }
      } else {
        return option as Exclude<Option, string | number | boolean | Date>
      }
    }

    function getComparisonValue(value: z.infer<typeof primitiveValue>) {
      if (value instanceof Date) {
        return `date:${value.valueOf()}`
      }

      return `${typeof value}:${value}`
    }

    const normalizedOptions: z.infer<typeof labelValue>[] = props.options.map(
      option => normalizeOption(option)
    )
    type Options = typeof props.options
    const optionMap = new Map(
      normalizedOptions.map((o, i) => [
        getComparisonValue(o.value),
        props.options[i],
      ])
    )

    let defaultValue = props.defaultValue?.map(d => normalizeOption(d))

    if (
      defaultValue &&
      defaultValue.every(val => !optionMap.has(getComparisonValue(val.value)))
    ) {
      logger.warn(
        'The defaultValue property must be a subset of the provided options, the provided defaultValue will be discarded.'
      )
      defaultValue = []
    }

    const stripper = labelValue.strip()

    return {
      props: {
        ...props,
        defaultValue: defaultValue?.map(o => stripper.parse(o)),
        options: normalizedOptions.map(o => stripper.parse(o)),
      },
      getValue(response: T_IO_RETURNS<'SELECT_MULTIPLE'>): Options {
        return response.map(r =>
          optionMap.get(getComparisonValue(r.value))
        ) as Options
      },
    }
  }
}
