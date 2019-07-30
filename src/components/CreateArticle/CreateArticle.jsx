import React, { Component } from "react";
import PropTypes from "prop-types";

import CreateArticleForm from "./CreateArticleForm/CreateArticleForm";

class CreateArticle extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      image: null,
      content: "",
      category: null,
      errors: [],
      categories: [],
      editing: false,
      article: null
    };
  }

  async componentWillMount() {
    const categories = await this.props.getArticleCategories();

    if (this.props.match.params.slug) {
      const article = this.props.articles.find(
        articleInArray => articleInArray.slug === this.props.match.params.slug
      );
      if (!article) {
        this.props.history.push('/user/articles');
        return;
      }
      this.setState({
        editing: true,
        article,
        categories,
        title: article.title,
        category: article.category_id,
        content: article.content
      });
    } else {
      this.setState({
        categories
      });
    }
  }

  updateArticle = async event => {
    event.preventDefault();
    try {
      await this.props.updateArticle(
        {
          title: this.state.title,
          image: this.state.image,
          content: this.state.content,
          category: this.state.category
        },
        this.state.article,
        this.props.token
      );
      this.props.notyService.success('Article updated successfully');
      this.props.history.push("/");
    } catch (errors) {
      console.log(errors);
      this.props.notyService.error('Please check for errors');
      this.setState({ errors });
    }
  };

  handleSubmit = async event => {
    event.preventDefault();

    try {
      await this.props.createArticle(this.state, this.props.token);
      this.props.notyService.success('Article created successfully');
      this.props.history.push("/");
    } catch (errors) {
      this.props.notyService.error('Please check for errors');
      this.setState({ errors });
    }
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]:
        event.target.type === "file"
          ? event.target.files[0]
          : event.target.value
    });
  };

  render() {
    return (
      <CreateArticleForm
        handleInputChange={this.handleInputChange}
        categories={this.state.categories}
        handleSubmit={this.handleSubmit}
        errors={this.state.errors}
        editing={this.state.editing}
        article={this.state.article}
        title={this.state.title}
        content={this.state.content}
        category={this.state.category}
        updateArticle={this.updateArticle}
      />
    );
  }
}

CreateArticle.propTypes = {
  getArticleCategories: PropTypes.func.isRequired,
  createArticle: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateArticle: PropTypes.func,
};

export default CreateArticle;
