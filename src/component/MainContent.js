
import React from "react";
import { BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams } from "react-router-dom";

import NotFound from 'component/NotFound';

export default function MainContent(props){

    let match = useRouteMatch();

    const renderPage = (param) => {
        return (
            <Switch>
                <Route exact path={match.url} component={InternalOrder}/>
                <Route path={`${match.url}/create`} render={(props)=><InternalOrderDetail {...props}/>}/>
                {/* <Route path={`${match.url}-default`} render={InternalOrderDetail}/> */}
                <Route component={NotFound}/>
            </Switch>
        )
    }

    return (
        <>
            <div id="main-content">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    {renderPage()}
                </div>
            </div>
        </>
    );
};

const InternalOrder = () => {
    return <>InternalOrder</>
}

const InternalOrderDetail = (props) => {
    console.log("create: ",props)
    return <>InternalOrderDetail</>
}