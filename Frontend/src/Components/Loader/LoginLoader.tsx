import React from 'react'
import Lottie from 'lottie-react'
import LoginLottie from '../../asserts/lottie/login.json'
import "./LoginLoader.scss"
const LoginLoader = () => {
  return (
    <div>
        <div className='outer-loader'>
        <Lottie 
            animationData={LoginLottie} 
            className='lottieStyle'
        />
    </div>
    </div>
  )
}

export default LoginLoader
