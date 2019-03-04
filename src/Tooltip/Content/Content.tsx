import * as React from 'react'
import { EMountHandlers } from '../enums';
const { useEffect } = React
// CSS
import classes from './Content.css'
// JSX
import Cancel from '../SVG/cancel'

interface IContentProps {
  // If the tooltip clicking functionality is disabled, then avoid rendering the cancel button.
  bIsClickingDisabled?: boolean
  /**
   * Function that will execute after mounting and before unmounting to calculate position
  /* and handle event listeners
   */
  setTooltip: (handler:string) => void
  // Triangle reference
  triangleReference: React.RefObject<SVGSVGElement>
  // Wrapper content events
  closeTooltip: () => void
  // Wrapper classes
  className?: string
  style?: React.CSSProperties
  // Wrapper reference
  reference: React.RefObject<HTMLDivElement>
  // Content reference
  contentReference: React.RefObject<HTMLDivElement>
  children?: any
}

const content = (props: IContentProps) => {
  useEffect(() => {
    // Calculates position and adds event listeners after mounting.
    if (props.setTooltip) {
      props.setTooltip(EMountHandlers.MOUNT)
    }
    // Removes event listeners before unmounting.
    return () => {
      if (props.setTooltip) {
        props.setTooltip(EMountHandlers.UNMOUNT)
      }
    }
  }, [])

  const wrapperClasses = [classes.Wrapper, props.className || classes.Default]

  const contentRef = props.contentReference
  if (!contentRef) { return null } // Avoid errors.

  return (
    <React.Fragment>
      <div 
        tabIndex={1}
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

export default content

interface ITriangleProps {
  reference?: React.RefObject<SVGSVGElement>
}

const Triangle = (props: ITriangleProps) => {
  return (
    <svg
      ref={props.reference}
      className={classes.Triangle}
      x='0px'
      y='0px'
      width='24px'
      height='24px'
      viewBox='0 0 20 20'>
      <path fill='inherit' d='M0,0 20,0 10,10z' />
      <path fill='transparent' stroke='#E6E6E6' d='M0,0 10,10 20,0' />
    </svg>
  )
}