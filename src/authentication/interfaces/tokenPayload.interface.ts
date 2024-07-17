import { UUID } from "crypto";

export default interface TokenPayload {
  userId: UUID;
}
