import React, {FunctionComponent, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import {selectScaleEditor, incrementStep, decrementStep, focusStep, setCurrentStep, previousStep, nextStep, incrementCurrentStep, decrementCurrentStep} from './scaleEditorSlice';
import {printPitch, parsePitch} from '../../pitch';

import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai'

import './ScaleEditor.sass'
import {useSynth} from '../synth/synth';


export const ScaleEditor: FunctionComponent = () => {
  const {steps} = useSelector(selectScaleEditor)
  const dispatch = useDispatch()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        dispatch(incrementCurrentStep())
        break;
      case 'ArrowDown':
        dispatch(decrementCurrentStep())
        break;

      case 'ArrowLeft':
        dispatch(previousStep())
        break

      case 'ArrowRight':
        dispatch(nextStep())
        break
    }
  }

  return <div className="ScaleEditor" onKeyDown={handleKeyDown}>
    {steps.map((step, i) => <ScaleEditorStep stepNumber={i} key={i} />)}
  </div>
}

export const ScaleEditorStep: FunctionComponent<{stepNumber: number, lowestPitch?: number}> = ({ stepNumber, lowestPitch}) => {
  const dispatch = useDispatch()
  const {steps, currentStep} = useSelector(selectScaleEditor)
  const pitch = steps[stepNumber]
  parsePitch(pitch)

  const synth = useSynth()
  useEffect(() => {
    synth.play(pitch)
  }, [pitch])

  const inputRef = useRef(null as null|HTMLInputElement)
  useEffect(() => {
    let input = inputRef.current
    if(input && currentStep === stepNumber)
      input.focus()
  }, [currentStep, pitch])



  let id = `ScaleEditorStep_${stepNumber}`

  return <div 
    className={classNames("ScaleEditorStep", {currentStep: currentStep === stepNumber})} 
    id={id}
    onMouseDown={() => dispatch(focusStep(stepNumber))}
  >
    <button onClick={() => dispatch(incrementStep(stepNumber))} className="IncrementPitchButton"><AiOutlineArrowUp/></button>
    <input 
      className="PitchDisplay" 
      ref={inputRef}
      value={pitch} 
      onChange={e => dispatch(setCurrentStep(e.target.value))}
      onFocus={() => synth.play(pitch)}
    />
    <button 
      className="DecrementPitchButton" 
      onClick={() => dispatch(decrementStep(stepNumber))}
    ><AiOutlineArrowDown/></button>
  </div>
}

export default ScaleEditor
