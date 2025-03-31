import React from 'react';
import { DefaultLayout } from 'layouts';
import style from './aboutUs.module.scss';
import { PageMeta } from "components";

const AboutUs : React.FC = () => {
    return (
    <>
    <PageMeta 
        title="About us" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
    />
    <DefaultLayout>
        <div className={style['about-us-container']}>
            <div className='
                pt-7 pb-7 px-[7vw] sm:pb-14 sm:px-[15vw] md:px-[20vw] lg:px-[22vw] xl:px-[27vw] 2xl:px-[31vw] 
                text-[1rem]'>
                <div className='mt-4'>
                    <b>Akaza</b> is a job listing platform that specifically caters for work from home opportunities with modern technological solutions. That’s technically what we do, but what we want to achieve is far more deeper than that.
                </div>
                <div className='mt-4'>
                Consider this: the average daily commute for full-time workers is around 1.25 hours - that adds up to around 20 hours a week and a staggering 240 hours a year.
                </div>
                <div className='mt-4'>
                Imagine how much more fulfilling your life could be if you could reclaim that time! It was a daily battle of either enduring traffic jams or being cramped on public transit, where you find yourself trapped next to the overly chatty commuter
                </div>
                <div className='mt-6'>
                <b>Akaza</b> was born out of the concerns of the present and the vision of the future. 
                </div>
                <div className='mt-6'>
                The benefits of working from home are clear: increased productivity and enhanced well-being. When done right, companies can reduce operational costs and boost profitability. Our mission is to revolutionize and  normalize working from home,  helping you spend more time doing what you love.

                </div>
                <div className='mt-4'>
                They say the wealthiest people in the world would trade everything to be young again and to have more time in their hands - this is a statement of how truly valuable Time really is.
                </div>
                <div className='mt-4'>
                At Akaza, we aim to give you that gift of time.
                Whether you’re seeking the perfect remote career or looking for the ideal candidate to elevate your business, we’re here to provide the tools you need.
                </div>
            </div>
        </div>
    </DefaultLayout>
    </>
    )
}

export { AboutUs }
