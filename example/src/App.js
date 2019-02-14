import React, { Component } from 'react'
// CSS
import classes from './App.css'
// JSX
import Tooltip from 'react-png-tooltip'

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='TopLeft'>
          <Tooltip background='indianred' className='IndianredTooltip'>Indianred Tooltip!</Tooltip>
          <br />
          This one's an indianred tooltip.
        </div>
        <div className='TopCenter'>
          <Tooltip background='darkblue' className='GoldTooltip'>The icon and the windows can have different colours though!</Tooltip>
        </div>
        <div className='TopRight'>
          <Tooltip>
            <img src='https://media0.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif?cid=3640f6095c64ef4962526264678e1c1c' alt='' />
            <br/>
            That was me while programming this component.
            <br/>
            <strong>(This is just to show you anything goes inside the tooltips)</strong>
          </Tooltip>
        </div>

        <div className='North'>
          <Tooltip>
            'North' positioned for lack of a better term, see how it defaults to the left?
            <br/>
            Unless you're on mobile, meaning it should be centered!
          </Tooltip>
        </div>

        <div className='CenterLeft'>
          <Tooltip className='OrangeTooltip' tooltip={<button className='CustomButton'>You can also use your own buttons as props.</button>}>
            And it still works as you'd expect!
          </Tooltip>
        </div>
        <div className='Center'>
          <Tooltip className='OrangeTooltip' background='#ff7043'>
            <h1>GOT YOU!</h1>
            <iframe type="text/html" 
                width='100%'
                height='400px'
                src="https://www.youtube.com/embed/DLzxrzFCyOs?autoplay=1"
                frameBorder="0">
            </iframe>
          </Tooltip>
        </div>
        <div className='CenterRight'>
          <Tooltip tooltip={<img className='CatTooltip' src='https://i.chzbgr.com/full/9112752128/h94C6655E/' />}>
            <img src='https://boygeniusreport.files.wordpress.com/2016/05/scared-surprised-cat-face.jpg?quality=98&strip=all&w=782' />
          </Tooltip>
        </div>

        <div className='BottomLeft'>
          <Tooltip background='skyblue' fill='white' className='DarkTooltip'>Dark Tooltip!</Tooltip> This one's a dark tooltip!
        </div>
        <div className='BottomRight'>
          <Tooltip className='OrangeTooltip' background='#ff7043'>
            I just don't know what other colors to use!
            <br/>
            Hope this component will be of any use to you, cheers! If you find any bugs, just let me know at:
            <br/>
            <strong>
              <a
                style={{color: 'white'}} 
                href='https://github.com/rmolinamir'
                target='_blank'
                ref='noopener noreferrer'>
                https://github.com/rmolinamir
              </a>
            </strong>
          </Tooltip>
        </div>
      </div>
    )
  }
}
