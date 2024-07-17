import * as express from 'express'
import { Query } from 'express-serve-static-core'
import { IncomingHttpHeaders } from 'node:http2'

interface ITypedRequest<T, U extends IncomingHttpHeaders, H extends Query> extends express.Request {
  body: T,
  headers: U,
  query: H,
}

export default ITypedRequest