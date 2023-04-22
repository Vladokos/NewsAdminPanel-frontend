import React from "react";
import axios from "axios";

import { ArticleInterface } from "../interface/article";
import { AxiosRequestConfig } from "../interface/AxiosInterface";

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
    const str = window.location.href.split('/')[4];

    this.setState({
      articleId: (this.state.articleId = str),
    });

    if (this.state.articleId.trim().length > 0) {
      const options: AxiosRequestConfig = {
        method: "POST",
        url: process.env.REACT_APP_SERVER_URL +`/article/${this.state.articleId}` ,
      };
      console.log(options)
      axios.request(options).then((response) => {

        if (response.status === 200) {
          const document: Array<ArticleInterface> = response.data;

          this.setState((state) => ({
            articleData: document,
          }));
        }
      });
      // axios.post(this.state.articleId).then((response) => {
      //   if (response.status === 200) {
      //     const document: Array<ArticleInterface> = response.data;

      //     this.setState((state) => ({
      //       articleData: document,
      //     }));

      //   }
      // });
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
