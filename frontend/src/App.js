import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Switch } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormPage";
// import SignupFormPage from "./components/SignupFormPage";
import LandingPage from "./components/LandingPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupsList from "./components/GroupsList";
import EventsList from "./components/EventsList";
import CreateGroup from "./components/CreateGroup";


//window.store.dispatch(window.sessionActions.restoreUser());

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
     <Navigation isLoaded={isLoaded} />
    {isLoaded && (
    <Switch>
      <Route exact path="/groups/new">
        <CreateGroup />
      </Route>


      <Route path="/groups/:groupId">
        Does this work GROUPID
      </Route>


      <Route exact path="/groups">
        <GroupsList />
      </Route>
      <Route path="/events">
        <EventsList />
      </Route>

      <Route exact path="/">
        <LandingPage />
      </Route>
      {/* <Route path="/login"> */}
        {/* <LoginFormPage /> */}
      {/* </Route> */}
      {/* <Route path="/signup">
          <SignupFormPage />
        </Route> */}
        <Route>
          404 Not Found
        </Route>
    </Switch>
    )}
    </>
  );
}

export default App;
