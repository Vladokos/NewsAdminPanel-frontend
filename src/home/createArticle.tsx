import React from "react";
import axios from "axios";

import { Articles } from "../interface/article";
import { AxiosRequestConfig } from "../interface/AxiosInterface";

type Props = {};

type State = {
  categories: string;
  title: string;
  text: string;
  styleText: string;
  intermediateText: string;
  id: number;
  link: string;
  articles: Array<Articles>;
  textEditing: boolean;
  image: File | null;
  imageName: String;
  oldImage: string;
};

export default class CreateArticle extends React.Component<Props, State> {
  state: State = {
    categories: "",
    title: "",
    text: "",
    styleText: "",
    intermediateText: "",
    id: 0,
    link: "",
    articles: [],
    textEditing: false,
    image: null,
    imageName: "",
    oldImage: "",
  };

  informationAboutArticle(
    inputLine:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    switch (inputLine.target.id) {
      case "category":
        this.setState({
          categories: inputLine.target.value,
        });
        break;
      case "title":
        this.setState({
          title: inputLine.target.value,
        });
        break;
      case "text":
        this.setState({
          text: inputLine.target.value,
        });
        break;
      default:
        break;
    }
  }

  openAllArticles() {
    this.setState((state) => ({
      textEditing: !this.state.textEditing,
    }));
  }

  clearContent() {
    this.setState((state) => ({
      id: 0,
      title: "",
      categories: "",
      text: "",
    }));
  }

  addLineBreak(key: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (key.code === "Enter") {
      const element = key.target as HTMLTextAreaElement;

      let state = this.state.text;
      let start = element.selectionStart;
      let end = element.selectionEnd;

      this.setState({
        text: state.substring(0, start) + "<br/><br/>" + state.substring(end),
      });
    }
  }

  addStyleText(style: React.KeyboardEvent<HTMLInputElement>) {
    const element = style.target as HTMLInputElement;
    if (style.key === "Enter" && !style.shiftKey) {
      switch (element.id) {
        case "bold":
          this.setState((state) => ({
            styleText: (this.state.styleText = " <b>" + element.value + "</b>"),
          }));
          this.setState((state) => ({
            text: (this.state.text += this.state.styleText),
            styleText: "",
          }));
          break;
        case "italic":
          this.setState((state) => ({
            styleText: (this.state.styleText =
              " <em>" + element.value + "</em>"),
          }));
          this.setState((state) => ({
            text: (this.state.text += this.state.styleText),
            styleText: "",
          }));
          break;
        case "link":
          this.setState((state) => ({
            styleText: (this.state.styleText =
              " <a href=" + this.state.link + ">" + element.value + "</a>"),
          }));
          this.setState((state) => ({
            text: (this.state.text += this.state.styleText),
            styleText: "",
            link: "",
          }));
          break;
        case "list":
          this.setState((state) => ({
            styleText: (this.state.styleText =
              " <ul>" + this.state.intermediateText + "</ul>"),
          }));
          this.setState((state) => ({
            text: (this.state.text += this.state.styleText),
            styleText: "",
          }));
          break;
        default:
          break;
      }
    } else if (style.key === "Enter" && style.shiftKey) {
      switch (element.id) {
        case "list":
          this.setState({
            styleText: (this.state.styleText +=
              "<li>" + element.value + "</li>"),
            intermediateText: (this.state.intermediateText +=
              this.state.styleText),
          });

          this.setState({
            styleText: "",
          });

          element.value = "";

          break;
        default:
          break;
      }
    }
  }

  sendArticle() {
    if (this.state.id === null || this.state.id === 0) {
      const options: AxiosRequestConfig = {
        method: "POST",
        url: process.env.REACT_APP_SERVER_URL +"/articleAdd",
        data: {
          category: this.state.categories,
          titles: this.state.title,
          texts: this.state.text,
          image: this.state.image,
        },
      };
      axios.request(options).then((response) => {
        if (response.status === 200) {
          const document = response.data.id;

          this.setState((state) => ({
            id: document,
          }));
          this.sendImage();
          this.getArticles();
        }
      });
    } else {
      const options: AxiosRequestConfig = {
        method: "PUT",
        url: process.env.REACT_APP_SERVER_URL +"/article",
        data: {
          id: this.state.id,
          titles: this.state.title,
          category: this.state.categories,
          texts: this.state.text,
        },
      };
      axios.request(options).then((response) => {
        if (response.status === 200) {
          this.sendImage();
          this.getArticles();
        }
      });
    }

    this.clearContent();
  }

  sendImage() {
    const data = new FormData();
    const image = this.state.image!;
    const oldImage = this.state.oldImage;
    const id = this.state.id;
    
    try {
      if (this.state.oldImage === this.state.image?.name) {
        data.append("image", image);
        data.append("id", id.toString());
      } else {
        data.append("image", image);
        data.append("oldImage", oldImage);
        data.append("id", id.toString());
      }
    } catch (Exception) {}

    axios({
      method: "PUT",
      url: process.env.REACT_APP_SERVER_URL +"/image",
      headers: { headers: { "Content-Type": "multipart/form-data" } },
      data: data,
    }).then((response) => {
      if (response.status === 200) {
        this.setState({
          id: 0,
        });
        this.getArticles();
      }
    });
  }

  getArticle(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const id = (e.target as HTMLButtonElement).value;

    axios.post(process.env.REACT_APP_SERVER_URL +`/article/${id}`).then((response) => {
      if (response.status === 200) {
        const document: Array<Articles> = response.data;
        
        this.setState((state) => ({
          id: (this.state.id = document[0].id),
          title: (this.state.title = document[0].title),
          categories: (this.state.categories = document[0].category),
          text: (this.state.text = document[0].text),
          imageName: (this.state.imageName = document[0].image),
          oldImage: (this.state.oldImage = document[0].image),
          textEditing: (this.state.textEditing = false),
        }));
      }
    });
  }

  getArticles() {
    axios.post(process.env.REACT_APP_SERVER_URL +"/article/").then((response) => {
      if (response.status === 200) {
        const document: Array<Articles> = response.data;
        this.setState((state) => ({
          articles: document,
        }));
      }
    });
  }

  deleteArticle() {
    if (this.state.id !== null || this.state.id !== "") {
      const id = this.state.id;
      const image = this.state.image;

      const options: AxiosRequestConfig = {
        method: "DELETE",
        url: process.env.REACT_APP_SERVER_URL +"/article/" + id,
        data: {
          image: image,
        },
      };
      axios.request(options).then((response) => {
        if (response.status === 200) {
          this.getArticles();
        }
      });

      this.clearContent();
    }
  }

  render(): React.ReactNode {
    return (
      <div>
        <div>
          <h2>Create panel</h2>
        </div>
        <form>
          <fieldset>
            <legend>Create an article</legend>
            <ul>
              <li>
                Add preview image: <br />
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files !== null) {
                      const file: File = e.target.files[0];
                      this.setState((state) => ({
                        image: (this.state.image = file),
                      }));
                    }
                  }}
                />
                <br />
              </li>
              <li>
                Enter title:
                <br />
                <input
                  id="title"
                  onChange={(e) => this.informationAboutArticle(e)}
                  value={this.state.title}
                />
              </li>
              <li>
                Enter category:
                <br />
                <input
                  id="category"
                  onChange={(e) => this.informationAboutArticle(e)}
                  value={this.state.categories}
                />
              </li>
              <li>
                Enter text:
                <br />
                <textarea
                  id="text"
                  onChange={(e) => this.informationAboutArticle(e)}
                  value={this.state.text}
                  onKeyDown={(e) => this.addLineBreak(e)}
                />
              </li>
              <button type="button" onClick={() => this.sendArticle()}>
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  this.getArticles();
                  this.openAllArticles();
                }}
              >
                Edit
              </button>
              <button type="button" onClick={() => this.deleteArticle()}>
                Delete
              </button>
            </ul>
            <ul>
              style:
              <li>
                Add bold: &lt;b&gt;
                <input id="bold" onKeyDown={(e) => this.addStyleText(e)} />
                &lt;/b&gt;
              </li>
              <li>
                Add italic: &lt;em&gt;
                <input
                  id="italic"
                  onKeyDown={(e) => this.addStyleText(e)}
                />
                &lt;/em&gt;
              </li>
              <li>
                Add link: &lt;a href=
                <input
                  id="href"
                  onChange={(e) => {
                    this.setState((state) => ({
                      link: (this.state.link = e.target.value),
                    }));
                  }}
                />
                &gt; <input id="link" onKeyDown={(e) => this.addStyleText(e)} />
                &lt;/a&gt;
              </li>
              <li>
                Add list: &lt;ul&gt; &lt;li&gt;
                <input id="list" onKeyDown={(e) => this.addStyleText(e)} />
                &lt;/li&gt; &lt;/ul&gt;
                <br />
                <b>
                  to add the next line in the list press shift + enter. When you
                  will be done press enter
                </b>
                <br />
                Example:
                <br />
                you wrote "asd" and press shift + enter after press enter and
                this will be &lt;li&gt;asd &lt;/li&gt; (1 set of the list)
              </li>
            </ul>
          </fieldset>
        </form>
        
        <div>
          <div>Category:{this.state.categories}</div>
          <div>Title:{this.state.title}</div>
          <div
            dangerouslySetInnerHTML={{ __html: "Text: " + this.state.text }}
          ></div>
        </div>
        
        <div
          className={this.state.textEditing === false ? "hidden" : "visible"}
        >
          All articles:
          <ul className="articles_list">
            {this.state.articles.map((article) => (
              <React.Fragment key={article.id + " fragment"}>
                <li key={article.id} className="articles">
                  <img src={process.env.REACT_APP_SERVER_URL +"/" + article.image} alt="" />
                  <br />
                  {article.category}
                  <br />
                  {article.title}
                  <br />
                  <p dangerouslySetInnerHTML={{ __html: article.text }}></p>
                </li>
                <button
                  key={article.id + " button"}
                  className="article_select"
                  type="button"
                  onClick={(e) => this.getArticle(e)}
                  value={article.id}
                >
                  select
                </button>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
