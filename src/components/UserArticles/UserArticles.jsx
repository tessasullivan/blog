import React, { Component } from "react";
import PropTypes from "prop-types";

import Articles from "./Articles/Articles";

class UserArticles extends Component {
  constructor() {
    super();

    this.state = {
      articles: {}
    };
  }

  async componentWillMount() {
    const articles = await this.props.getUserArticles(this.props.token);

    this.setState({ articles });
    this.props.setArticles(articles.data);
  }

  handlePagination = async url => {
    const articles = await this.props.getUserArticles(this.props.token, url);

    this.setState({ articles });
    this.props.setArticles(articles.data);
  };

  editArticle = article => {
    this.props.history.push(`/article/edit/${article.slug}`);
  }
  deleteArticle = async id => {
    console.log(`delete article id ${id} token ${this.props.token}`)
    await this.props.deleteArticle(id, this.props.token);
    // remove article from list
    const articles = this.state.articles.data.filter(
      article => article.id !== id
    );
    this.setState({
      articles: {
        data: articles
      }
    });
  };

  render() {
    return (
      <Articles
        articles={this.state.articles.data}
        nextUrl={this.state.articles.next_page_url}
        prevUrl={this.state.articles.prev_page_url}
        handlePagination={this.handlePagination}
        editArticle={this.editArticle}
        deleteArticle={this.deleteArticle}
      />
    );
  }
}

UserArticles.propTypes = {
  getArticles: PropTypes.func.isRequired,
  setArticles: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func.isRequired,
};

export default UserArticles;
