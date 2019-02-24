import React, { Component } from 'react'
// CSS
import './App.css'
// JSX
import Tooltip from 'react-png-tooltip'

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='Tooltips'>
          <div>
            <Tooltip shouldDisableClick background='indianred' className='IndianredTooltip'>With the clicking functionality disabled!</Tooltip>
            <div className='Anchor'>
              <span className='Description'>This one's an indianred tooltip with <code>shouldDisableClick</code> active.</span>
            </div>
          </div>
          
          <div>
            <Tooltip shouldDisableHover background='darkblue' className='GoldTooltip'>The icon and the windows can have different colours though!</Tooltip>
            <div className='Anchor'>
              <span className='Description'>This tooltip has <code>shouldDisableHover</code> active.</span>
            </div>
          </div>

          <div>
            <Tooltip>
              <img src='https://media0.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif?cid=3640f6095c64ef4962526264678e1c1c' alt='' />
              Accurate representation of me while programming this component.
              <br />
              <strong>(This is just to show you anything goes inside the tooltips)</strong>
            </Tooltip>
          </div>
        </div>

        <div className='Tooltips'>
          <div>
            <Tooltip>
              <strong>This is the default color setting for the tooltips.</strong>
              <br />
              Absolutely positioned in the center. The tooltip will always render to wherever it has more space.
              If on mobile it'll tend to be centered inside the viewport.
            </Tooltip>
          </div>

          <div>
            <Tooltip className='OrangeTooltip' tooltip={<button className='CustomButton'>You can also use your own buttons as props.</button>}>
              And it still works as you'd expect!
            </Tooltip>
          </div>
          
          <div>
            <Tooltip className='OrangeTooltip' background='#ff7043'>
              <iframe 
                  title='rickroll'
                  type="text/html" 
                  width='100%'
                  height='400px'
                  src="https://www.youtube.com/embed/DLzxrzFCyOs?autoplay=1"
                  frameBorder="0">
              </iframe>
            </Tooltip>
          </div>

          <div>
            <Tooltip tooltip={<img alt='' className='CatTooltip' src='https://i.chzbgr.com/full/9112752128/h94C6655E/' />}>
              <img alt='' src='https://boygeniusreport.files.wordpress.com/2016/05/scared-surprised-cat-face.jpg?quality=98&strip=all&w=782' />
            </Tooltip>
          </div>
        </div>

        <div className='Tooltips'>
          <div>
            <Tooltip background='skyblue' fill='white' className='DarkTooltip'>Dark Tooltip!</Tooltip>
            <span style={{zIndex: -1}}>This one's a dark tooltip!</span>
          </div>

          <div>
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
                  rel="noopener noreferrer">
                  https://github.com/rmolinamir
                </a>
              </strong>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}
