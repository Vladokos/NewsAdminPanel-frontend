import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Article from "./article";
import AllArticle from "./allArticle";


export default class HomePage extends React.Component {
  render(): React.ReactNode {
    return (
      <Router>
        <div>
          <Route path="/article">
            <Article />
          </Route>
          <Route path="/" exact>
            <AllArticle />
          </Route>
        </div>
      </Router>
    );
  }
}
