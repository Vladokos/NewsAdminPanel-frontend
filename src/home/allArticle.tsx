import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Articles } from "../interface/article";

type Props = {};

type State = {
  articles: Array<Articles>;
};

export default class AllArticle extends React.Component<Props, State> {
  state: State = {
    articles: [],
  };

  componentDidMount() {
    axios.get("/article/").then((response) => {
      if (response.statusText === "OK") {
        const document: Array<Articles> = response.data;
        
        this.setState((state) => ({
          articles: document,
        }));
       
      }
    });
  }

  render(): React.ReactNode {
    return (
      <div>
        <h1>Home Page</h1>
        <div>
          <h2>Articles:</h2>

          <div className="articles_roster">
            {this.state.articles.map((article) => (
           
              <Link to={"/article/" + article.id} key={article.id + "link"}>
                <div key={article.id + " fragment"}>
                  <picture>
                    <img key={article.id + "img"} src={article.image} alt="" />
                  </picture>
                  <br />
                  <br />
                  <span key={article.id + "title"} className="title_articles">
                    {article.title}
                  </span>
                  <br />
                  <br />
                  <span
                    key={article.id + "category"}
                    className="category_articles"
                  >
                    {article.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
