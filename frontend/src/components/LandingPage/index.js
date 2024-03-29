
import "./LandingPage.css";
import { NavLink } from 'react-router-dom';
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from '../SignupFormModal';
import { useSelector } from "react-redux";
// import { useEffect } from "react";

import { urlToImg } from "../aaComponentMiddleware";

import { useHistory } from "react-router-dom";

const LandingPage = () => {

    const currentUser = useSelector((state) => state.session.user);
    // console.log(currentUser);

    const createDisabledOrNo = () => {
            try {
                if (currentUser) {
                    //console.log("currentuser")
                    return "landing-not-disabled";
                } else {
                    return "landing-disabled";
                }
            } catch {
                return "landing-not-disabled";
            }

    }

    const joinMeetupDisabled = () => {
        try {
            if (currentUser) {
                // console.log("join meetup9 currentuser")
                return "join-meetup-disabled";
            } else {
                return "join-meetup-enabled"
            }
        } catch {
            return "join-meetup-enabled";
        }
    }

    const history = useHistory();

    return (
       <>
       <div className="landing-page-wrapper">
        <div className="landing-page-top">
            <div className="lp-top-left">
                <h1>
                The people platform—<br></br>
                Where interests become friendships
                </h1>
                <p>
                Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—log in to join the fun.
                <br></br><br></br>
                </p>
            </div>
            <div className="lp-top-right">
            <img className="lp-picture" src="https://github.com/j1jlee/API-project/blob/main/images/landing-smaller.png?raw=true"></img>
            </div>
        </div>

        <div className="landing-page-middle">
            <h2 className="lp-middle-works">
                How Meetup works
            </h2>
            <p>
            Meet new people who share your interests through online and in-person events. It’s free to create an account.
            </p>
        </div>

        <div className="landing-page-bottom">
            <div className="lp-bottom-left">
                <div className="landing-page-pointer" onClick={() => history.push("/groups")}>
                    {urlToImg("https://github.com/j1jlee/API-project/blob/main/images/landing/landing-1.png?raw=true")}
                </div>

                <NavLink to="/groups">See all groups</NavLink>
                <div>
                    Do what you love, meet others who love it, find your community. The rest is history!
                </div>
            </div>

            <div className="lp-bottom-middle">
                 <div className="landing-page-pointer" onClick={() => history.push("/events")}>
                    {urlToImg("https://github.com/j1jlee/API-project/blob/main/images/landing/landing-3.png?raw=true")}
                </div>
                <NavLink to="/events">Find an event</NavLink>
                <div>
                Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.
                </div>
            </div>
            <div className="lp-bottom-right">
                <div className="landing-page-pointer" onClick={() => history.push("/groups/new")}>
                    {urlToImg("https://github.com/j1jlee/API-project/blob/main/images/landing/landing-2.png?raw=true")}
                </div>
                <NavLink to="/groups/new" className={createDisabledOrNo()}>Start a new group</NavLink>
                <div>
                You don’t have to be an expert to gather people together and explore shared interests.
                </div>
            </div>

        </div>

        <div className={joinMeetupDisabled()}>
        <OpenModalButton
          buttonText="Join Meetup"
          modalComponent={<SignupFormModal />}
        />
        </div>
        <br></br>
        <br></br>
        {/* <img src="https://github.com/j1jlee/API-project/blob/main/images/jedi/jedi-01.png?raw=true"></img> */}
        </div>

       </>
    );
}

export default LandingPage;
