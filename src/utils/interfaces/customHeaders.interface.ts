import { IncomingHttpHeaders } from 'node:http2'

interface ICustomHeaders extends IncomingHttpHeaders {
  futureHeader?: string,
}

export default ICustomHeaders