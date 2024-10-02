import { z } from 'zod'
import { Literal, IO_RENDER, buttonItem, metaItemSchema } from '../ioSchema.js'
import {
  AnyDisplayIOPromise,
  ButtonItem,
  PageError,
  EventualValue,
} from '../types.js'

type EventualString = EventualValue<string>

export interface BasicLayoutConfig {
  title?: EventualString
  description?: EventualString
  children?: AnyDisplayIOPromise[]
  menuItems?: ButtonItem[]
}

export interface Layout {
  title?: EventualString
  description?: EventualString
  children?: AnyDisplayIOPromise[]
  menuItems?: ButtonItem[]
  errors?: PageError[]
}

// Base class
export class BasicLayout implements Layout {
  title?: EventualString
  description?: EventualString
  children?: AnyDisplayIOPromise[]
  menuItems?: ButtonItem[]
  errors?: PageError[]

  constructor(config: BasicLayoutConfig) {
    this.title = config.title
    this.description = config.description
    this.children = config.children
    this.menuItems = config.menuItems
    this.errors = []
  }
}

export type MetaItemSchema = z.infer<typeof metaItemSchema>

export type MetaItemValue = Literal | bigint

export interface MetaItem extends Omit<MetaItemSchema, 'value' | 'error'> {
  label: string
  value:
    | MetaItemValue
    | Promise<MetaItemValue>
    | (() => MetaItemValue)
    | (() => Promise<MetaItemValue>)
  error?: string
}

// For superjson (de)serialization
export const META_ITEMS_SCHEMA = z.object({
  json: z.array(metaItemSchema),
  meta: z.any(),
})

export type MetaItemsSchema = z.infer<typeof META_ITEMS_SCHEMA>

export const LAYOUT_ERROR_SCHEMA = z.object({
  layoutKey: z.string().optional(),
  error: z.string(),
  message: z.string(),
  cause: z.string().optional(),
  stack: z.string().optional(),
})

export const BASIC_LAYOUT_SCHEMA = z.object({
  kind: z.literal('BASIC'),
  title: z.string().nullish(),
  description: z.string().nullish(),
  children: IO_RENDER.nullish(),
  metadata: META_ITEMS_SCHEMA.optional(),
  menuItems: z.array(buttonItem).nullish(),
  errors: z.array(LAYOUT_ERROR_SCHEMA).nullish(),
})

// To be extended with z.discriminatedUnion when adding different pages
export const LAYOUT_SCHEMA = BASIC_LAYOUT_SCHEMA

export type LayoutSchema = z.infer<typeof LAYOUT_SCHEMA>
export type LayoutSchemaInput = z.input<typeof LAYOUT_SCHEMA>
export type BasicLayoutSchema = z.infer<typeof BASIC_LAYOUT_SCHEMA>
export type BasicLayoutSchemaInput = z.input<typeof BASIC_LAYOUT_SCHEMA>
export type LayoutError = z.infer<typeof LAYOUT_ERROR_SCHEMA>

export { metaItemSchema as META_ITEM_SCHEMA }
