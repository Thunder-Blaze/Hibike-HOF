import React from 'react'

const Banner = () => {
  return (
    <div className='flex flex-col w-full'>
        <h1 className='font-bold mb-3 text-4xl'>Home</h1>
        <div className='flex flex-col items-start p-6 gap-6 rounded-2xl bg-gradient-to-br from-violet-700 to-violet-900 justify-center'>
            <h1 className='text-white text-2xl font-mono'>Hibike</h1>
            <p className='text-white text-sm'>A Web3-powered marketplace where fans become music rights holders, and creators remix with freedom</p>
        </div>
    </div>
  )
}

export default Banner
