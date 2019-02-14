import React, { Component } from 'react'
import classes from './App.css'
import Tooltip from 'react-png-tooltip'

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='TopLeft'>
          <Tooltip background='indianred' containerClassname='IndianredTooltip'>Indianred Tooltip!</Tooltip>
          <br />
          This one's an indianred tooltip.
        </div>
        <div className='TopCenter'>
          <Tooltip background='darkblue' containerClassname='GoldTooltip'>The icon and the windows can have different colours though!</Tooltip>
        </div>
        <div className='TopRight'>
          <Tooltip>Top Right</Tooltip>
        </div>

        <div className='North'>
          <Tooltip>
            'North' positioned for lack of a better term, see how it defaults to the left?
            <br/>
            Unless you're on mobile, meaning it should be centered!
          </Tooltip>
        </div>

        <div className='CenterLeft'>
          <Tooltip>Center Left</Tooltip>
        </div>
        <div className='Center'>
          <Tooltip>Center</Tooltip>
        </div>
        <div className='CenterRight'>
          <Tooltip>Center Right</Tooltip>
        </div>

        <div className='BottomLeft'>
          <Tooltip background='skyblue' fill='white' containerClassname='DarkTooltip'>Dark Tooltip!</Tooltip> This one's a dark tooltip!
        </div>
        <div className='BottomRight'>
          <Tooltip>Bottom Right</Tooltip>
        </div>
      </div>
    )
  }
}
