import * as React from 'react'
const { useState, useRef, useMemo, useEffect } = React
import { EMountHandlers, EQuarters } from './enums';
// Worker function
import { isMobile as setIsMobile } from './is-mobile'
// CSS
import classes from './Tooltip.css'
// JSX
import QuestionMark from './SVG/question-mark'
import Content from './Content/Content'

interface ITooltipProps {
  // Tooltip propTypes (style and JSX element replacement)
  tooltip: React.ReactNode
  fill: string
  background: string
  wrapperClassName: string
  className: string
  // Tooltip functionality
  shouldDisableHover: boolean
  shouldDisableClick: boolean
  children: React.ReactNode
}

const tooltip = (props: ITooltipProps) => {
  // Boolean, true if on a mobile device.
  const isMobile = setIsMobile()
  // References, cries in React Hooks.
  const myTooltip = useRef<HTMLSpanElement>(null)
  const myWrapper= useRef<HTMLDivElement>(null)
  const myContent= useRef<HTMLDivElement>(null)
  const myTriangle= useRef<SVGSVGElement>(null)
  // Hover timeout to unmount tooltip.
  const [onMouseLeaveTimeout, setMouseLeaveTimeout] = useState()

  // Initial states
  const [bIsHidden, setIsHidden] = useState(true)
  const [bIsNotHovered, setIsNotHovered] = useState(true)

  /**
   * Calculates in which quarter of the screen the element is at.
   */
  const calculateQuarter = (rect: ClientRect, viewportX: number, viewportY: number):string => {
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
  const smartPositioning = (quarter:string):void => {
    if (myContent.current && myTriangle.current) {
      // Content spacing.
      const contentVertical = [24, 'px'].join('')
      const contentHorizontal = [-18, 'px'].join('')
      // Triangle SVG spacing.
      const triangleVertical = [100, '%'].join('')
      const triangleHorizontal = [6, 'px'].join('')
      switch (quarter) {
        case EQuarters.TOP_LEFT:
          // Container position
          myContent.current.style.top = contentVertical
          myContent.current.style.left = contentHorizontal
          // Triangle position
          myTriangle.current.style.bottom = triangleVertical
          myTriangle.current.style.left = triangleHorizontal
          myTriangle.current.style.transform = 'rotate(180deg)'
          break
        case EQuarters.TOP_RIGHT:
          // Container position
          myContent.current.style.top = contentVertical
          myContent.current.style.right = contentHorizontal
          // Triangle position
          myTriangle.current.style.bottom = triangleVertical
          myTriangle.current.style.right = triangleHorizontal
          myTriangle.current.style.transform = 'rotate(180deg)'
          break
        case EQuarters.BOTTOM_LEFT:
          // Container position
          myContent.current.style.bottom = contentVertical
          myContent.current.style.left = contentHorizontal
          // Triangle position
          myTriangle.current.style.top = triangleVertical
          myTriangle.current.style.left = triangleHorizontal
          myTriangle.current.style.transform = 'none'
          break
        case EQuarters.BOTTOM_RIGHT:
          // Container position
          myContent.current.style.bottom = contentVertical
          myContent.current.style.right = contentHorizontal
          // Triangle position
          myTriangle.current.style.top = triangleVertical
          myTriangle.current.style.right = triangleHorizontal
          myTriangle.current.style.transform = 'none'
          break
      }
    }
  }

  /**
   * watchOverflow will determine if the element is overflown (outside of viewport).
   * If it's overflown, then transform the element to the left so that it'll be inside the viewport,
   * and the tooltip will be legible.
   */
  const watchOverflow = ():void => {
    if (!myContent.current || !myTriangle.current || !myTooltip.current) { return } // Avoid crashes
    const viewportX:number = Math.max(document.documentElement.clientWidth || 0)
    const contentRect:ClientRect = myContent.current.getBoundingClientRect()
    const overflowX:number = (contentRect.width + contentRect.left) - viewportX
    const transformArray:string[] = ['']
    let bIsOverflownX = false
    let bIsOverflownY = false
    if (overflowX >= 0) { // Right Side
      transformArray.push(`translateX(-${overflowX + 12}px)`)
      myTriangle.current.style.left = `(-${12}px)`
      bIsOverflownX = true
    } else if (contentRect.left < 0) { // Left Side
      transformArray.push(`translateX(${Math.abs(contentRect.left) + 12}px)`)
      bIsOverflownX = true
    }
    /**
     * If overflown from the top, then move the tooltip down until it's inside the viewport.
     * The triangle SVG will be hidden since it won't point to the tooltip.
     */
    if (contentRect.top < 0) {
      bIsOverflownY = true
      transformArray.push(`translateY(${Math.abs(contentRect.top) + 12}px)`)
      myTriangle.current.style.visibility = 'hidden'
    }
    /**
     * If overflown on the X axis, then move the triangle so that it'll point
     * to the tootip, while keeping the transform rotate property if it exists.
     */
    if (bIsOverflownX) {
      const tooltipRect: ClientRect = myTooltip.current.getBoundingClientRect()
      const triangleRect: ClientRect = myTriangle.current.getBoundingClientRect()
      /**
       * We need the middle point of the tooltip and the triangle, to make sure
       * that we will be translating the triangle to the center of the tooltip,
       * so that it will align perfectly.
       */
      const tooltipXMidPoint:number = tooltipRect.left + ((tooltipRect.right - tooltipRect.left) / 2)
      const triangleXMidPoint:number = triangleRect.left + ((triangleRect.right - triangleRect.left) / 2)
      const distance:number = tooltipXMidPoint - triangleXMidPoint
      if (String(myTriangle.current.style.cssText).includes('rotate')) {
        myTriangle.current.style.transform = `translateX(${distance}px) rotate(180deg)`
      } else {
        myTriangle.current.style.transform = `translateX(${distance}px)`
      }
    }
    /**
     * Apply transform styling.
     */
    if (bIsOverflownX || bIsOverflownY) {
      myContent.current.style.transform = transformArray.join(' ')
    }
  }

  /**
   * Determines the positioning of the Tooltips based on the position inside the viewport WHEN OPENED,
   * and watches if it's overflowing the viewport. If it's overflowing, then it will translate the tooltip
   * to the left.
   */
  const calculatePosition = ():void => {
    if (myContent.current && myTriangle.current) {
      const viewportX:number = Math.max(document.documentElement.clientWidth || 0)
      const viewportY:number = Math.max(document.documentElement.clientHeight || 0)
      const rect:ClientRect = myContent.current.getBoundingClientRect()
      const quarter:string = calculateQuarter(rect, viewportX, viewportY)
      smartPositioning(quarter)
      watchOverflow()
      /**
       * Finally although not having to do anything with positioning, we set the triangle SVG fill EQUAL
       * to the background color of the content window of the tooltip.
       */
      const contentBackgroundColor:string | null = window.getComputedStyle(myContent.current).backgroundColor
      myTriangle.current.style.fill = contentBackgroundColor
    }
  }

  /**
   * When on mobile, if an orientation change event happens, close the modal to avoid bugs.
   */
  useEffect(() => {
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
  const eventListenersHandler = (handler: string):void => {
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
    }
  }

  const setVisibility = (handler: string):void => {
    if (!myContent.current || !myTooltip.current) { return } // Protection
    switch (handler) {
      case EMountHandlers.MOUNT:
        myTooltip.current.style.overflow = null
        myContent.current.style.visibility = null
        break
      case EMountHandlers.UNMOUNT:
        myTooltip.current.style.overflow = 'hidden'
        myContent.current.style.visibility = 'hidden'
        break
    }
  }

  const setTooltip = (handler: string):void => {
    switch (handler) {
      case EMountHandlers.MOUNT:
        /**
         * The tooltip should only calculate on mount.
         */
        /**
         * If the tooltip is active, then calculate then:
         * 1. Set the wrapper overflow and the tooltip's visibility as hidden to avoid parasitic page jumps.
         * 2. Calculate then .focus() the wrapper element to open the tooltip.
         * 3. Calculate the position (position: absolute coordinates).
         * 4. Applies or removes event listeners that manage the tooltip.
         * 5. Reset the wrapper's overflow and tooltip visibility as null to show the tooltip.
         */
        if (!myWrapper.current || !myTooltip.current) { return } // Protection
        setVisibility(EMountHandlers.UNMOUNT) // To avoid parasitic page jumps
        calculatePosition()
        eventListenersHandler('ADD')
        myWrapper.current.focus()
        setVisibility(handler)
        break
      // Removes the event listener if the tooltip is being hidden.
      case EMountHandlers.UNMOUNT:
        setVisibility(handler)
        eventListenersHandler('REMOVE')
        break
    }
  }

  /**
   * If the user is hovering the tooltip then open it, otherwise close it UNLESS the user clicked on the tooltip.
   */
  const onHoverHandler = (handler:boolean, event:any) => {
    // Disabled on mobile devices (no hover) or if the shouldDisableHover prop is true.
    if (isMobile || props.shouldDisableHover) { return }
    if (!handler) {
      // Clearing timeout on mouse leave event.
      clearTimeout(onMouseLeaveTimeout)
      setMouseLeaveTimeout(undefined)
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
      if (myTooltip.current) {
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
  const outsideClickListener = (event: MouseEvent) => {
    if (myTooltip.current) {
      const element: HTMLSpanElement = myTooltip.current
      if (!element.contains(event.target as Node)) {
        closeTooltip()
      }
    }
  }

  // Close the tooltip when the ESC is pressed.
  const escFunction = (event:KeyboardEvent) => {
    if (event.keyCode === 27) {
      closeTooltip()
    }
  }

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
    /**
     * Optimization, only update virtual DOM if there is a change in bIsHidden or bIsNotHovered.
     */
    useMemo(() => (
      <span
        /**
        * DO NOT REMOVE THE INITIAL OVERFLOW: HIDDEN.
        * It helps smoothing the initial tooltip mount.
        */
        style={{ overflow: 'hidden' }}
        ref={myTooltip}
        className={props.wrapperClassName ? props.wrapperClassName : classes.Wrapper}
        // On mouse hover handlers.
        onMouseOver={() => onHoverHandler(false, null)}
        onMouseLeave={(event) => onHoverHandler(true, event)}
        onClick={toggleTooltip}>
        {props.tooltip ? props.tooltip
          : <QuestionMark fill={props.fill} background={props.background} />}
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
      </span>
    ), [bIsHidden, bIsNotHovered])
  )
}

export default tooltip
