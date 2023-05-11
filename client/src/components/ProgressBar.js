import './Auth.css'

const ProgressBar = ({progress}) => {
    return (
      <div className="outer-bar">
        <div className="inner-bar"
        style={{width: `${progress}%`, backgroundColor: 'black'}}
        ></div>
      </div>
    )
  }
  
  export default ProgressBar