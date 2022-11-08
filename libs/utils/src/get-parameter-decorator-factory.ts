import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'

// eslint-disable-next-line @typescript-eslint/ban-types
export function getParameterDecoratorFactory(decorator: Function) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public test(@decorator() value) {}
  }

  const arguments_ = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test')
  return arguments_[Object.keys(arguments_)[0]].factory
}
