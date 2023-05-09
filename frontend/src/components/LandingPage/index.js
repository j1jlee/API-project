
import "./LandingPage.css";
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
    return (
       <>
       <div className="landing-page-wrapper">
        <div className="landing-page-top">
            <div className="lp-top-left">
                <h1>
                The people platform— Where interests become friendships
                </h1>
                <p>
                Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—log in to join the fun.
                </p>
            </div>
            <div className="lp-top-right">
            PLACEHOLDER PICTURE HERE
            </div>
        </div>

        <div className="landing-page-middle">
            <h2>
                How Meetup works
            </h2>
            <p>
            Meet new people who share your interests through online and in-person events. It’s free to create an account.
            </p>
        </div>

        <div className="landing-page-bottom">
            <div className="lp-bottom-left">
                <NavLink to="/groups">See all groups</NavLink>
                <div>
                    Do what you love, meet others who love it, find your community. The rest is history!
                </div>
            </div>
            <div className="lp-bottom-middle">
                <NavLink to="/events">Find an event</NavLink>
                <div>
                Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.
                </div>
            </div>
            <div className="lp-bottom-right">
                <NavLink to="where/where" className="/groups/new">Start a new group</NavLink>
                <div>
                You don’t have to be an expert to gather people together and explore shared interests.
                </div>
            </div>

        </div>

        </div>
       </>
    );
}

export default LandingPage;
