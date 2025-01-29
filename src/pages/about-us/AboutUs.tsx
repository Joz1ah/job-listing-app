import React from 'react';
import { DefaultLayout } from 'layouts';
import style from './aboutUs.module.scss';
import linesGroup from 'assets/about-us/lines-group.png';
import peopleInTrain from 'assets/about-us/people-in-train.png';
import squareStretch from 'assets/about-us/square-stretch.png';
import commuteVsWfh from 'assets/about-us/commute-vs-wfh.png';

const AboutUs : React.FC = () => {
    return (
    <DefaultLayout>
        <div className={style['about-us-wrapper']}>
            <div className={style['lines-group']}>
                <img src={linesGroup}/>
            </div>
            <div className={style['about-us-container']}>
                <div className={style['para1']}>
                    <div>
                        <b>Akaza</b> is a job listing platform that specifically caters for work from home opportunities with modern technological solutions.
                    </div>
                    <div>
                        That's technically what we do, but what we want to achieve is far more deeper than that.
                    </div>
                </div>
                <div className={style['para2-wrapper']}>
                    <div className={style['para2']}>
                        <div>Consider this: <i>the average</i> </div>
                        <div><u><i>daily commute for full-time</i></u></div>
                        <div><u><i>workers is around 1.25 hours</i></u></div>
                        <div><u>that adds up to around 20</u></div>
                        <div>hours a week and a</div>
                        <div><b>staggering 240 hours a year.</b></div>
                    </div>
                    <div>
                        <img src={peopleInTrain}/>
                        <img src={squareStretch}/>
                    </div>
                </div>
                <div className={style.para3}>
                    <div>
                        Imagine how much more fulfilling your life could be if you could reclaim that time! It was a daily battle of either enduring traffic jams or being cramped on public transit, where you find yourself trapped next to the overly chatty commuter
                    </div>
                    <div>
                        You know exactly what I'm talking about.
                    </div>
                </div>
                <div className={style.para4}>
                    <div></div>
                    <div>
                        After the lockdown, society experienced a significant shift. Anxiety levels rose, meal prep services flourished, many companies embraced remote work, technical advancements were at an all time high and many more.
                    </div>
                    <div>
                        was born out of the concerns of the present and the vision of the future. 
                    </div>
                </div>
                <div className={style.para5}>
                    The benefits of working from home are clear: increased productivity and enhanced well-being. When done right, companies can reduce operational costs and boost profitability. Our mission is to revolutionize and  normalize working from home,  helping you spend more time doing what you love.
                </div>
                <div className={style['commute-vs-wfh']}>
                    <img src={commuteVsWfh}></img>
                </div>
                <div className={style.para6}>
                    They say the wealthiest people in the world would trade everything to be young again and to have more time in their hands - this is a statement of how truly valuable Time really is.
                </div>
                <div className={style.para7}>
                    <div>
                        <div>At Akaza, we aim to give you that gift of time.</div>
                        <div>
                            Whether you’re seeking the perfect remote career or looking for the ideal candidate to elevate your business, we’re here to provide the tools you need.
                            Redefining Remote Hiring
                            Efficient Hiring, Without Borders
                            Work from Home, Reimagined
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </DefaultLayout>
    )
}

export { AboutUs }
