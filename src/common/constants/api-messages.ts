export const UNAUTHORIZED =
  'The user is not authorized to access this resource.'
export const FORBIDDEN = 'The user access to this resource is forbidden'

export const ONE_SUCCESSFULLY_RETRIEVED = (entityName: string) =>
  `The ${entityName} has been successfully retrieved.`
export const MANY_SUCCESSFULLY_FOUND = (entityName: string) =>
  `The ${entityName}s have been successfully retrieved.`
export const NOT_BEEN_FOUND = (entityName: string) =>
  `The ${entityName} has not been found.`
export const SUCCESSFULLY_CREATED = (entityName: string) =>
  `The ${entityName} has been successfully created.`
export const SUCCESSFULLY_UPDATED = (entityName: string) =>
  `The ${entityName} has been successfully updated.`
export const SUCCESSFULLY_REMOVED = (entityName: string) =>
  `The ${entityName} has been successfully removed.`

export const ONE_IS_INVALID = (propertyName: string) =>
  `The given ${propertyName} is invalid.`

export const MANY_ARE_INVALID = (propertyName: string) =>
  `The given ${propertyName} are invalid.`

export const ALREADY_BEEN_TAKEN = (propertyName: string) =>
  `The given ${propertyName} has already been taken.`

export const PROPERTY_SUCCESSFULLY_UPDATED = (propertyName: string) =>
  `The ${propertyName} has been successfully updated.`

export const PROPERTY_SUCCESSFULLY_REMOVED = (propertyName: string) =>
  `The ${propertyName} has been successfully removed.`

export const PROPERTY_SUCCESSFULLY_ADDED = (propertyName: string) =>
  `The ${propertyName} has been successfully added.`

export const PROPERTY_SUCCESSFULLY_RETRIEVED = (propertyName: string) =>
  `The ${propertyName} has been successfully retrieved.`

export const PROPERTY_NOT_FOUND = (propertyName: string) =>
  `The ${propertyName} has not been found.`
