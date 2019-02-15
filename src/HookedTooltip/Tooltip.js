import React, { useState, useRef, useMemo } from 'react'
import propTypes from 'prop-types'
// Worker function
import { isMobile as setIsMobile } from './is-mobile'
// CSS
import classes from './Tooltip.css'
// JSX
import QuestionMark from './SVG/question-mark'
import Content from './Content/Content'

const tooltip = (props) => {
  // Boolean, true if on a mobile device.
  const isMobile = setIsMobile()
  // References, cries in React Hooks.
  const myTooltip = useRef(null)
  const myWrapper = useRef(null)
  const myContent = useRef(null)
  const myTriangle = useRef(null)
  // Hover timeout to unmount tooltip.
  const [onMouseLeaveTimeout, setMouseLeaveTimeout] = useState(null)

  // Initial states
  const [bIsHidden, setIsHidden] = useState(true)
  const [bIsNotHovered, setIsNotHovered] = useState(true)

  /**
   * Calculates in which quarter of the screen the element is at.
   */
  const calculateQuarter = (rect, viewportX, viewportY) => {
    const response = []
    if (rect.top >= viewportY / 2) {
      response.push('bottom')
    } else {
      response.push('top')
    }
    if (rect.left >= viewportX / 2) {
      response.push('right')
    } else {
      response.push('left')
    }
    return response.join('_')
  }

  /**
   * Depending of which quarter of the screen the element is at (calculated in calculateQuarter), then
   * assings CSS style properties to the tooltip container (and triangle) respective to the quarter
   * to ensure the tooltip will be completely shown in the screen.
   */
  const smartPositioning = (quarter) => {
    switch (quarter) {
      case QUARTERS.TOP_LEFT:
        // Container position
        myContent.current.style.top = [36, 'px'].join('')
        myContent.current.style.left = [-18, 'px'].join('')
        // Triangle position
        myTriangle.current.style.top = [13, 'px'].join('')
        break
      case QUARTERS.TOP_RIGHT:
        // Container position
        myContent.current.style.top = [36, 'px'].join('')
        myContent.current.style.right = [-18, 'px'].join('')
        // Triangle position
        myTriangle.current.style.top = [13, 'px'].join('')
        break
      case QUARTERS.BOTTOM_LEFT:
        // Container position
        myContent.current.style.bottom = [24, 'px'].join('')
        myContent.current.style.left = [-18, 'px'].join('')
        // Triangle position
        myTriangle.current.style.bottom = [1, 'px'].join('')
        myTriangle.current.style.transform = 'none'
        break
      case QUARTERS.BOTTOM_RIGHT:
        // Container position
        myContent.current.style.bottom = [24, 'px'].join('')
        myContent.current.style.right = [-18, 'px'].join('')
        // Triangle position
        myTriangle.current.style.bottom = [1, 'px'].join('')
        myTriangle.current.style.transform = 'none'
        break
      default:
        // Copying QUARTERS.BOTTOM_LEFT settings for the default case.
        // Container position
        myContent.current.style.bottom = [24, 'px'].join('')
        myContent.current.style.left = [-18, 'px'].join('')
        // Triangle position
        myTriangle.current.style.bottom = [1, 'px'].join('')
        myTriangle.current.style.transform = 'none'
    }
  }

  /**
   * watchOverflow will determine if the element is overflown (outside of viewport).
   * If it's overflown, then transform the element to the left so that it'll be inside the viewport,
   * and the tooltip will be legible.
   */
  const watchOverflow = (rect) => {
    if (!rect) { return } // Avoid crashes
    const viewportX = Math.max(document.documentElement.clientWidth || 0)
    const contentRect = myContent.current.getBoundingClientRect()
    if ((contentRect.width + contentRect.left) >= viewportX) { // Right Side
      myContent.current.style.transform = `translateX(-${contentRect.right - contentRect.width - 12}px)`
    } else if (contentRect.left < 0) { // Left Side
      myContent.current.style.transform = `translateX(${Math.abs(contentRect.left) + 12}px)`
    }
  }

  /**
   * Determines the positioning of the Tooltips based on the position inside the viewport WHEN OPENED,
   * and watches if it's overflowing the viewport. If it's overflowing, then it will translate the tooltip
   * to the left.
   */
  const calculatePosition = () => {
    if (!myContent.current && !myTriangle.current) { return } // Avoid crashes
    const viewportX = Math.max(document.documentElement.clientWidth || 0)
    const viewportY = Math.max(document.documentElement.clientHeight || 0)
    const rect = myContent.current.getBoundingClientRect()
    const quarter = calculateQuarter(rect, viewportX, viewportY)
    smartPositioning(quarter)
    watchOverflow(rect)
    /**
     * Finally although not having to do anything with positioning, we set the triangle SVG fill EQUAL
     * to the background color of the content window of the tooltip.
     */
    const contentBackgroundColor = window.getComputedStyle(myContent.current).backgroundColor
    myTriangle.current.style.fill = contentBackgroundColor
  }

  /**
   * When on mobile, if an orientation change event happens, close the modal to avoid bugs.
   */
  useState(() => {
    window.addEventListener('resize', closeTooltip)
    if (isMobile) {
      window.addEventListener('orientationchange', closeTooltip)
    }
    // on Unmount
    return () => {
      // Remove any event listener that might be active.
      if (isMobile) {
        window.removeEventListener('orientationchange', closeTooltip)
      }
      window.removeEventListener('resize', closeTooltip)
      // Document event listeners.
      eventListenersHandler('REMOVE')
      // Clearing timeout on mouse leave event.
      clearTimeout(onMouseLeaveTimeout)
    }
  }, [])

  /**
   * Adds or removes event listeners, depending if on a mobile or on a desktop.
   */
  const eventListenersHandler = (handler) => {
    switch (handler) {
      case 'ADD':
        if (isMobile) {
          document.addEventListener('touchend', outsideClickListener)
        } else if (!isMobile) {
          document.addEventListener('click', outsideClickListener)
          document.addEventListener('keydown', escFunction, false)
        }
        break
      case 'REMOVE':
        if (isMobile) {
          document.removeEventListener('touchend', outsideClickListener)
        } else if (!isMobile) {
          document.removeEventListener('click', outsideClickListener)
          document.removeEventListener('keydown', escFunction, false)
        }
        break
      default:
        // do nothing
    }
  }

  const setTooltip = (handler) => {
    switch (handler) {
      case 'MOUNT':
        /**
         * The tooltip should only calculate on mount.
         */
        /**
         * If the tooltip is active, then calculate then:
         * 1. Calculate then .focus() the wrapper element to open the tooltip.
         * 2. Calculate the position (position: absolute coordinates).
         * 3. Applies or removes event listeners that manage the tooltip.
         */
        if (!myWrapper.current) { return } // Protection
        myWrapper.current.focus()
        calculatePosition()
        eventListenersHandler('ADD')
        // Removes the event listener if the tooltip is being hidden.
        break
      case 'UNMOUNT':
        eventListenersHandler('REMOVE')
        break
      default:
        eventListenersHandler('REMOVE')
    }
  }

  /**
   * If the user is hovering the tooltip then open it, otherwise close it UNLESS the user clicked on the tooltip.
   */
  const onHoverHandler = (handler, event) => {
    // Disabled on mobile devices (no hover) or if the shouldDisableHover prop is true.
    if (isMobile || props.shouldDisableHover) { return }
    if (!handler) {
      // Clearing timeout on mouse leave event.
      clearTimeout(onMouseLeaveTimeout)
      setMouseLeaveTimeout(null)
      setIsNotHovered(handler)
    } else {
      /**
       * Event persist is called to avoid receiving null events if the component dismounts.
       * We declare X and Y positions to know where is the mouse pointer hovering. The result of this
       * boolean will be stored in bIsHoveringTooltip. Next, onMouseLeaveTimeout will fire within
       * 100ms, these 100ms will let the user have some time to hover the tooltip. IF the user hovers
       * over the tooltip bIsHoveringTooltip will be true and the tooltip won't be dismounted, however
       * if the user pulls the mouse away from the tooltip the tooltip will be dismounted.
       */
      event.persist()
      const x = event.clientX
      const y = event.clientY
      const bIsHoveringTooltip = myTooltip.current.contains(document.elementFromPoint(x, y))
      if (!bIsHoveringTooltip) {
        setMouseLeaveTimeout(
          setTimeout(() => {
            setIsNotHovered(handler)
          }, 100)
        )
      }
    }
  }

  const toggleTooltip = () => {
    // Disabled if the shouldDisableHover prop is true.
    if (props.shouldDisableClick) { return }
    setIsHidden(!bIsHidden)
  }

  const closeTooltip = () => {
    // Disabled if the shouldDisableHover prop is true.
    if (props.shouldDisableClick) { return }
    setIsHidden(true)
    setIsNotHovered(true)
  }

  /**
   * Closes the tooltip as long as the click was made outside of the tooltip wrapper.
   * The wrapper contains:
   * 1. The tooltip button.
   * 2. The tooltip window.
   */
  const outsideClickListener = event => {
    const element = myTooltip.current
    if (!element.contains(event.target) && isVisible(element)) {
      closeTooltip()
    }
  }

  // Close the tooltip when the ESC is pressed.
  const escFunction = (e) => {
    if (e.keyCode === 27) {
      closeTooltip()
    }
  }

  /**
   * Optimization, only update virtual DOM if there is a change in bIsHidden or bIsNotHovered.
   */
  // shouldComponentUpdate(_, nextState) {
  //   return bIsHidden !== nextbIsHidden || bIsNotHovered !== nextbIsNotHovered
  // }

  /**
   * The tooltip content will render if bIsHidden if false or if the tooltip is not hovered.
   * This means that bIsHidden being true will have priority, which means if the user clicks the tooltip,
   * then it won't be unmounted when unhovering the tooltip.
   */
  let shouldRender = false
  if (!bIsHidden) {
    shouldRender = true
  } else if (!bIsNotHovered) {
    shouldRender = true
  }
  return (
    useMemo(() => (
      <div ref={myTooltip}
        className={props.tooltip ? null : classes.Container}
        // On mouse hover handlers.
        onMouseOver={() => onHoverHandler(false)}
        onMouseLeave={(event) => onHoverHandler(true, event)}>
        <i
          /**
          * onMouseDown event fires before onBlur event on input. It calls event.preventDefault() to
          * prevent onBlur from being called, and doesn't prevent the navLink click from happening,
          * this guarantees that the NavLink will redirect on click without having to use SetTimeout
          * or any other hack.
          */
          onMouseDown={event => event.preventDefault()}
          onClick={toggleTooltip} >
          {props.tooltip ? props.tooltip
            : (
              <QuestionMark fill={props.fill} background={props.background} />
            )}
        </i>
        {shouldRender ? (
          <Content
            bIsClickingDisabled={props.shouldDisableClick}
            className={props.className}
            setTooltip={setTooltip}
            reference={myWrapper}
            contentReference={myContent}
            triangleReference={myTriangle}
            closeTooltip={closeTooltip} >
            {props.children}
          </Content>)
          : null}
      </div>
    ), [bIsHidden, bIsNotHovered])
  )
}

tooltip.propTypes = {
  // Tooltip propTypes (style and JSX element replacement)
  tooltip: propTypes.element,
  fill: propTypes.string,
  background: propTypes.string,
  className: propTypes.string,
  // Tooltip functionality
  shouldDisableHover: propTypes.bool,
  shouldDisableClick: propTypes.bool,
  children: propTypes.any
}

/**
 * If an element is visible.
 */
const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

const QUARTERS = {
  TOP_LEFT: 'top_left',
  TOP_RIGHT: 'top_right',
  BOTTOM_LEFT: 'bottom_left',
  BOTTOM_RIGHT: 'bottom_right'
}

export default tooltip
