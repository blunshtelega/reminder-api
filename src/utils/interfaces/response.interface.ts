import * as express from 'express'
import { Send } from "express-serve-static-core"

interface ITypedResponse<T> extends express.Response {
  json: Send<T, this>;
}

export default ITypedResponse