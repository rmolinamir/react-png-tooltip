// import React, { useRef, useEffect } from 'react'
import React from 'react'
import propTypes from 'prop-types'
// CSS
import classes from './Content.css'
// JSX
import Cancel from '../SVG/cancel'

const Triangle = (props) => {
  return (
    <svg
      ref={props.reference}
      className={classes.Triangle}
      x='0px'
      y='0px'
      width='24px'
      height='24px'
      viewBox='0 0 20 20'
      style={{ enableBackground: 'new 0 0 20 20' }}>
      <path fill='inherit' d='M0,0 20,0 10,10z' />
      <path fill='transparent' stroke='#E6E6E6' d='M0,0 10,10 20,0' />
    </svg>
  )
}

Triangle.propTypes = {
  reference: propTypes.object
}

const content = (props) => {
  const wrapperClasses = [classes.Wrapper]
  if (props.className) {
    wrapperClasses.push(props.className)
  }

  const contentRef = props.contentReference
  if (!contentRef) { return null } // Avoid errors.

  return (
    <React.Fragment>
      <div tabIndex='1'
        ref={props.reference}
        className={wrapperClasses.join(' ')}
        style={props.style}>
        <div
          ref={contentRef}
          className={classes.Container}>
          <Triangle reference={props.triangleReference} />
          {props.bIsClickingDisabled ? null
            : <button onClick={props.closeTooltip} type='button' className={classes.Cancel}><Cancel /></button>}
          <div onMouseDown={(event) => event.preventDefault()} className={classes.Content}>
            {props.children}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

content.propTypes = {
  // If the tooltip clicking functionality is disabled, then avoid rendering the cancel button.
  bIsClickingDisabled: propTypes.bool,
  // Triangle reference classes
  triangleReference: propTypes.object,
  // Wrapper content events
  closeTooltip: propTypes.func,
  // Wrapper classes
  className: propTypes.any,
  style: propTypes.object,
  // Wrapper reference
  reference: propTypes.object,
  // Content reference
  contentReference: propTypes.object,
  children: propTypes.any
}

export default content
