interface ITooltipState {
  onMouseLeaveTimeout?: NodeJS.Timeout
  bIsHidden: boolean
  bIsNotHovered: boolean
}

declare enum EEventListenersHandlers {
  ADD,
  REMOVE
}

interface IReducerAction extends ITooltipState {
  handler: EOnChangeHandler
}

declare enum EOnChangeHandler {
  VALUE,
  VALID,
  TOUCHED,
  STATE
}