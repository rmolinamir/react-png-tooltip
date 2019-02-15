import React, { Component } from 'react'
import PropTypes from 'prop-types'
// Worker function
import { isMobile } from './is-mobile'
// CSS
import classes from './Tooltip.css'
// JSX
import QuestionMark from './SVG/question-mark'
import Content from './Content/Content'

const QUARTERS = {
  TOP_LEFT: 'top_left',
  TOP_RIGHT: 'top_right',
  BOTTOM_LEFT: 'bottom_left',
  BOTTOM_RIGHT: 'bottom_right'
}

export default class Tooltip extends Component {
  static propTypes = {
    // Tooltip propTypes (style and JSX element replacement)
    tooltip: PropTypes.element,
    fill: PropTypes.string,
    background: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any
  }

  constructor(props) {
    super(props)
    // Boolean, true if on a mobile device.
    this.isMobile = isMobile()
    // References, cries in React Hooks.
    this.myTooltip = React.createRef()
    this.myWrapper = React.createRef()
    this.myContent = React.createRef()
    this.myTriangle = React.createRef()
  }

  state = { // Initial state
    bIsHidden: true,
    bIsHovered: false
  }

  /**
   * Calculates in which quarter of the screen the element is at.
   */
  calculateQuarter = (rect, viewportX, viewportY) => {
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
  smartPositioning = (quarter) => {
    switch (quarter) {
      case QUARTERS.TOP_LEFT:
        // Container position
        this.myContent.current.style.top = [36, 'px'].join('')
        this.myContent.current.style.left = [-18, 'px'].join('')
        // Triangle position
        this.myTriangle.current.style.top = [13, 'px'].join('')
        break
      case QUARTERS.TOP_RIGHT:
        // Container position
        this.myContent.current.style.top = [36, 'px'].join('')
        this.myContent.current.style.right = [-18, 'px'].join('')
        // Triangle position
        this.myTriangle.current.style.top = [13, 'px'].join('')
        break
      case QUARTERS.BOTTOM_LEFT:
        // Container position
        this.myContent.current.style.bottom = [24, 'px'].join('')
        this.myContent.current.style.left = [-18, 'px'].join('')
        // Triangle position
        this.myTriangle.current.style.bottom = [1, 'px'].join('')
        this.myTriangle.current.style.transform = 'none'
        break
      case QUARTERS.BOTTOM_RIGHT:
        // Container position
        this.myContent.current.style.bottom = [24, 'px'].join('')
        this.myContent.current.style.right = [-18, 'px'].join('')
        // Triangle position
        this.myTriangle.current.style.bottom = [1, 'px'].join('')
        this.myTriangle.current.style.transform = 'none'
        break
      default:
        // Copying QUARTERS.BOTTOM_LEFT settings for the default case.
        // Container position
        this.myContent.current.style.bottom = [24, 'px'].join('')
        this.myContent.current.style.left = [-18, 'px'].join('')
        // Triangle position
        this.myTriangle.current.style.bottom = [1, 'px'].join('')
        this.myTriangle.current.style.transform = 'none'
    }
  }

  /**
   * watchOverflow will determine if the element is overflown (outside of viewport).
   * If it's overflown, then transform the element to the left so that it'll be inside the viewport,
   * and the tooltip will be legible.
   */
  watchOverflow = (rect) => {
    if (!rect) { return } // Avoid crashes
    const viewportX = Math.max(document.documentElement.clientWidth || 0)
    const contentRect = this.myContent.current.getBoundingClientRect()
    if ((contentRect.width + contentRect.left) >= viewportX) { // Right Side
      this.myContent.current.style.transform = `translateX(-${contentRect.right - contentRect.width - 12}px)`
    } else if (contentRect.left < 0) { // Left Side
      this.myContent.current.style.transform = `translateX(${Math.abs(contentRect.left) + 12}px)`
    }
  }

  /**
   * Determines the positioning of the Tooltips based on the position inside the viewport WHEN OPENED,
   * and watches if it's overflowing the viewport. If it's overflowing, then it will translate the tooltip
   * to the left.
   */
  calculatePosition = () => {
    if (!this.myContent.current && !this.myTriangle.current) { return } // Avoid crashes
    const viewportX = Math.max(document.documentElement.clientWidth || 0)
    const viewportY = Math.max(document.documentElement.clientHeight || 0)
    const rect = this.myContent.current.getBoundingClientRect()
    const quarter = this.calculateQuarter(rect, viewportX, viewportY)
    this.smartPositioning(quarter)
    this.watchOverflow(rect)
    /**
     * Finally although not having to do anything with positioning, we set the triangle SVG fill EQUAL
     * to the background color of the content window of the tooltip.
     */
    const contentBackgroundColor = window.getComputedStyle(this.myContent.current).backgroundColor
    this.myTriangle.current.style.fill = contentBackgroundColor
  }

  /**
   * When on mobile, if an orientation change event happens, close the modal to avoid bugs.
   */
  componentDidMount() {
    window.addEventListener('resize', this.closeTooltip)
    if (this.isMobile) {
      window.addEventListener('orientationchange', this.closeTooltip)
    }
  }

  /**
   * Adds or removes event listeners, depending if on a mobile or on a desktop.
   */
  eventListenersHandler = (handler) => {
    switch (handler) {
      case 'ADD':
        if (this.isMobile) {
          document.addEventListener('touchend', this.outsideClickListener)
        } else if (!this.isMobile) {
          document.addEventListener('click', this.outsideClickListener)
          document.addEventListener('keydown', this.escFunction, false)
        }
        break
      case 'REMOVE':
        if (this.isMobile) {
          document.removeEventListener('touchend', this.outsideClickListener)
        } else if (!this.isMobile) {
          document.removeEventListener('click', this.outsideClickListener)
          document.removeEventListener('keydown', this.escFunction, false)
        }
        break
      default:
        // do nothing
    }
  }

  componentDidUpdate() {
    /**
     * If the tooltip is active, then calculate then:
     * 1. Calculate then .focus() the wrapper element to open the tooltip.
     * 2. Calculate the position (position: absolute coordinates).
     * 3. Applies or removes event listeners that manage the tooltip.
     */
    if (!this.state.bIsHidden) {
      this.myWrapper.current.focus()
      this.calculatePosition()
      this.eventListenersHandler('ADD')
    // Removes the event listener if the tooltip is being hidden.
    } else {
      this.eventListenersHandler('REMOVE')
    }
  }

  componentWillUnmount() {
    // Remove any event listener that might be active.
    if (this.isMobile) {
      window.removeEventListener('orientationchange', this.closeTooltip)
    }
    window.remove('resize', this.closeTooltip)
    // Document event listeners.
    this.eventListenersHandler('REMOVE')
  }

  toggleTooltip = () => {
    this.setState(prevState => {
      return {
        bIsHidden: !prevState.bIsHidden
      }
    })
  }

  closeTooltip = () => {
    this.setState({
      bIsHidden: true
    })
  }

  /**
   * Closes the tooltip as long as the click was made outside of the tooltip wrapper.
   * The wrapper contains:
   * 1. The tooltip button.
   * 2. The tooltip window.
   */
  outsideClickListener = event => {
    const element = this.myTooltip.current
    if (!element.contains(event.target) && isVisible(element)) {
      this.closeTooltip()
    }
  }

  // Close the tooltip when the ESC is pressed.
  escFunction = (e) => {
    if (e.keyCode === 27) {
      this.closeTooltip()
    }
  }

  render() {
    return (
      <div ref={this.myTooltip}
        className={this.props.tooltip ? null : classes.Container}>
        <i
          /**
          * onMouseDown event fires before onBlur event on input. It calls event.preventDefault() to
          * prevent onBlur from being called, and doesn't prevent the navLink click from happening,
          * this guarantees that the NavLink will redirect on click without having to use SetTimeout
          * or any other hack.
          */
          onMouseDown={event => event.preventDefault()}
          onClick={this.toggleTooltip} >
          {this.props.tooltip ? this.props.tooltip
            : (
              <QuestionMark fill={this.props.fill} background={this.props.background} />
            )}
        </i>
        {this.state.bIsHidden ? null
          : (
            <Content
              className={this.props.className}
              onMount={this.calculatePosition}
              reference={this.myWrapper}
              contentReference={this.myContent}
              triangleReference={this.myTriangle}
              closeTooltip={this.closeTooltip} >
              {this.props.children}
            </Content>
          )}
      </div>
    )
  }
}

/**
 * If an element is visible.
 */
const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
