import React, { Component } from "react";
import PropTypes from "prop-types";
import draftToHtml from "draftjs-to-html";
import htmlToDraftjs from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import CreateArticleForm from "./CreateArticleForm/CreateArticleForm";

class CreateArticle extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      image: null,
      content: EditorState.createEmpty(),
      category: null,
      errors: [],
      categories: [],
      editing: false,
      article: null
    };
  }

  async componentWillMount() {
    if (this.props.match.params.slug) {
      const article = this.props.articles.find(
        articleInArray => articleInArray.slug === this.props.match.params.slug
      );
      if (!article) {
        this.props.history.push("/user/articles");
        return;
      }
      const { contentBlocks, entityMap } = htmlToDraftjs(article.content);

      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const categories = await this.props.getArticleCategories();
      this.setState({
        editing: true,
        article,
        categories,
        title: article.title,
        category: article.category_id,
        // content: article.content
        content: EditorState.createWithContent(contentState),
      });
    } else {
      const categories = await this.props.getArticleCategories();
      this.setState({
        categories
      });
    }
  };

  handleEditorState = editorState => {
    this.setState({
      content: editorState
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    try {
      await this.props.createArticle(
        {
          title: this.state.title,
          image: this.state.image,
          content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
          category: this.state.category
        },
        this.props.token
      );
      this.props.notyService.success("Article created successfully");
      this.props.history.push("/");
    } catch (errors) {
      this.props.notyService.error("Please check for errors");
      this.setState({ errors });
    }
  };

  handleEditorState = editorState => {
    this.setState({
      content: editorState
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      await this.props.createArticle(
        {
          title: this.state.title,
          content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
          category: this.state.category,
          image: this.state.image
        },
        this.props.token
      );
      this.props.notyService.success("Article created successfully");
      this.props.history.push("/");
    } catch (errors) {
      console.log(errors);
      this.props.notyService.error("Please check for errors");
      this.setState({ errors });
    }
  };

  handleInputChange = event => {
    // console.log(`${event.target.name}: ${event.target.value} ${typeof (event.target.value)}`);
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
        handleEditorState={this.handleEditorState}
      />
    );
  }
}

CreateArticle.propTypes = {
  getArticleCategories: PropTypes.func.isRequired,
  createArticle: PropTypes.func,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateArticle: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string
    }).isRequired
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      created_at: PropTypes.string
    })
  ),
  notyService: PropTypes.shape({
    success: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired
  })
};

CreateArticle.defaultProps = {
  updateArticle: () => {},
  // createArticle: () => {},
  articles: []
};
export default CreateArticle;
