import Logger from './Logger'
import Chronicals, {
  ChronicalsActionDefinition,
  Page,
  QueuedAction,
} from '../index'
import { Ctx } from 'evt'

/**
 * This is effectively a namespace inside of Chronicals with a little bit of its own state.
 */
export default class Routes {
  protected chronicals: Chronicals
  #logger: Logger
  #apiKey?: string
  #endpoint: string
  #groupChangeCtx: Ctx<void>

  constructor(
    chronicals: Chronicals,
    endpoint: string,
    logger: Logger,
    ctx: Ctx<void>,
    apiKey?: string
  ) {
    this.chronicals = chronicals
    this.#apiKey = apiKey
    this.#logger = logger
    this.#endpoint = endpoint + '/api/actions'
    this.#groupChangeCtx = ctx
  }

  /**
   * @deprecated Use `chronicals.enqueue()` instead.
   */
  async enqueue(
    slug: string,
    args: Pick<QueuedAction, 'assignee' | 'params'> = {}
  ): Promise<QueuedAction> {
    return this.chronicals.enqueue(slug, args)
  }

  /**
   * @deprecated Use `chronicals.dequeue()` instead.
   */
  async dequeue(id: string): Promise<QueuedAction> {
    return this.chronicals.dequeue(id)
  }

  add(slug: string, route: ChronicalsActionDefinition | Page) {
    if (!this.chronicals.config.routes) {
      this.chronicals.config.routes = {}
    }

    if (route instanceof Page) {
      route.onChange.attach(this.#groupChangeCtx, () => {
        this.chronicals.client?.handleActionsChange(this.chronicals.config)
      })
    }

    this.chronicals.config.routes[slug] = route
    this.chronicals.client?.handleActionsChange(this.chronicals.config)
  }

  remove(slug: string) {
    for (const key of ['routes', 'actions', 'groups'] as const) {
      const routes = this.chronicals.config[key]

      if (!routes) continue
      const route = routes[slug]
      if (!route) continue

      if (route instanceof Page) {
        route.onChange.detach(this.#groupChangeCtx)
      }

      delete routes[slug]

      this.chronicals.client?.handleActionsChange(this.chronicals.config)
      return
    }
  }
}
