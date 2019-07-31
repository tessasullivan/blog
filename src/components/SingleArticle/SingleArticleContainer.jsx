import React, {Component} from "react";
import PropTypes from "prop-types";

import Article from "./Article/SingleArticle";

class SingleArticleContainer extends Component {
  constructor() {
    super();

    this.state = {
      article: null,
      loading: true
    };
  }
  async componentWillMount() {
    // Try to find article from set passed to container
    let article = this.props.articles.find(
      articleInArray => articleInArray.slug === this.props.match.params.slug
    );

    // If it is found in the set passed, set state, otherwise, request article from server
    if (article) {
      this.setState({ article, loading: false });
    } else {
      article = await this.props.getArticle(this.props.match.params.slug);
      this.setState({ article, loading: false });
    }
  }

  render() {
    return (
      <div>
        {/* Wait until article is retrieved to pass it to the rendering component */}

        {!this.state.loading && <Article article={this.state.article} />}
        {this.state.loading && <p className="text-center">LOADING ...</p>}
      </div>
    );
  }
}

SingleArticleContainer.propTypes = {
  getArticle: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      created_at: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SingleArticleContainer;
