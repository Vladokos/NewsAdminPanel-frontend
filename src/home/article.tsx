import React from "react";
import axios from "axios";

import { ArticleInterface } from "../interface/article";

type Props = {};

type State = {
  articleId: string;
  articleData: Array<ArticleInterface>;
};

export default class Article extends React.Component<Props, State> {
  state: State = {
    articleId: "",
    articleData: [],
  };

  componentDidMount() {
    const str = window.location.href.substring(30);

    this.setState({
      articleId: (this.state.articleId = str),
    });

    if (this.state.articleId.trim().length > 0) {
      axios.get(`/article/${this.state.articleId}`).then((response) => {
        if (response.statusText === "OK") {
          const document: Array<ArticleInterface> = response.data;

          this.setState((state) => ({
            articleData: document,
          }));

        }
      });
    }
  
  }

  render(): React.ReactNode {
    return (
      <div>
        <div>
          <span className="title_article">
            {this.state.articleData[0]?.title}
          </span>
          <br />
          <br />
          <span className="category_article">
            {this.state.articleData[0]?.category}
          </span>
          <br />
          <br />
          <div className="article_text">
            <p
              dangerouslySetInnerHTML={{
                __html: this.state.articleData[0]?.text,
              }}
            ></p>
          </div>
        </div>
      </div>
    );
  }
}
