import React from 'react'

// Checks the type of a react Element
// - first by its type.name
// - second by its props.typeOf
// props.typeOf allows a component to delcare API compatability with another component type
const isOfType = (component, type) => {
  const types = Array.isArray(type) ? type : [type]
  return component && (
    types.includes(component?.type?.name)
    || types.includes(component?.props?.ofType)
  )
}

// Accepts a components children prop, returning the number of children of which match isOfType
const hasChildOfType = (children, type) => (
  React.Children.toArray(children).filter((child) => isOfType(child, type)).length
)

// Merges component props with passed object, proioritizing component's props
const mergeProps = (component, props) => (
  component ? React.cloneElement(component, { ...props, ...component.props }) : null
)

// Merges component props with passed object, proioritizing argument props
const overrideProps = (component, props) => (
  component ? React.cloneElement(component, { ...component.props, ...props }) : null
)

export {
  isOfType,
  hasChildOfType,
  mergeProps,
  overrideProps,
}
