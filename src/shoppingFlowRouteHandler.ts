import { CACHE_PAGES } from './cache'
import { RouteHandler } from '@layer0/core/router/Router'
import { injectBrowserScript } from '@layer0/starter'
import { CustomCacheKey } from '@layer0/core/router'
import { HTTP_HEADERS } from '@layer0/core/constants'

const handler: RouteHandler = async ({ cache, removeUpstreamResponseHeader, proxy }) => {
  const key = new CustomCacheKey().addHeader(HTTP_HEADERS.x0Device, (header) => {
    header.group('mobile').byPattern(/^(smartphone|mobile)$/)
    header.group('desktop').byPattern(/^(tablet|desktop)$/)
  })

  cache(Object.assign(CACHE_PAGES, { key }))
  removeUpstreamResponseHeader('set-cookie') // The presence of a set-cookie header would prevent the response from being cached, so ensure set-cookie headers are removed.
  proxy('origin', { transformResponse: injectBrowserScript }) // inject browser.ts into the document returned from the origin
}

export default handler
