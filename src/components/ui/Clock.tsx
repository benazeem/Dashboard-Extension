'use client';
import { SlidingNumber } from '../ui/sliding-number';
import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = (time.getHours()>12?time.getHours()-12:time.getHours());
  const m = (time.getMinutes());
  const s = (time.getSeconds());
  const timeMeridian = time.getHours()>= 12 ? "PM" : "AM";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[time.getDay()];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[time.getMonth()];
  const date = time.getDate();


  return (
    
    <div className='flex flex-col justify-center items-center gap-4 font-mono text-[200px] text-white w-full h-full select-none '>
      <div className='flex gap-4 items-start justify-center'>
      {[h,m,s].map((num, index) => (<>
        {/* <div key={index} className='bg-[#131313] rounded-lg px-2 py-1'> */}
        <div className='flex justify-center items-center' key={`time-${index}`} >
          <SlidingNumber value={num} padStart={true} />
        {/* </div> */}
        {index < 2 && <div className='text-white/50 text-8xl font-mono'>:</div>}
        </div>
        </>
      ))}
      <div className='text-white/50 text-2xl font-mono '>{timeMeridian}</div>
      </div>
      <div className='text-white/50 text-2xl font-mono '>{`${day} - ${date}/${month}`}</div>
    </div>
  );
}
