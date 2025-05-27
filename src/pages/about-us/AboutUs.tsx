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
                    <b>Akaza</b> is a skills-based job matching platform built to fix what’s broken in hiring. And there’s a lot.
                </div>
                <div className='mt-4'>
                    We focus on remote and hybrid roles, but more importantly, we focus on fit.
                    Not just what’s on a résumé, but what someone can actually do. Because right
                    now, most hiring still depends on outdated systems that waste everyone’s
                    time, especially when you’re just trying to find someone solid, or land a role
                    you’re genuinely good at.
                </div>
                <div className='mt-6'>
                    <i><b>Akaza</b> was born out of the concerns of the present and the vision of the future. </i>
                    We’re trying to take the guesswork out of hiring, to help people show what
                    they bring to the table, and to help companies feel more confident in who
                    they bring on.
                </div>
                <div className='mt-6'>
                    We’re also thinking beyond the first match. The goal isn’t just to fill a role,
                    it’s to build something that lasts. That means making sure the right people
                    connect, for the right reasons.
                </div>
                <div className='mt-4'>
                    We're still early, and we're learning as we go. But we’re building Akaza to
                    make hiring more human, more thoughtful, and a whole lot less painful.
                </div>
                <div className='mt-4'>
                    If that’s something you’ve been craving, we’re building it for you.
                </div>
            </div>
        </div>
    </DefaultLayout>
    </>
    )
}

export { AboutUs }
