import { Interceptor, InterceptorInterface, Action } from "routing-controllers";
import { deepConvertKeysToSnake } from "../utils/case";

@Interceptor()
export class SnakeCaseInterceptor implements InterceptorInterface {
  intercept(_action: Action, content: unknown): unknown {
    return deepConvertKeysToSnake(content);
  }
}
