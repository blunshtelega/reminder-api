import { Query } from 'express-serve-static-core'

interface ICustomQuery extends Query{
  futureQuery?: string,
}

export default ICustomQuery