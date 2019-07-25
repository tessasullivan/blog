import React, { Component } from "react";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      errors: {}
    };
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    try {
      const user = await this.props.registerUser(this.state);

      // Store the registered user locally
      localStorage.setItem("user", JSON.stringify(user));
      this.props.setAuthUser(user);
      this.props.history.push("/");

      // If there are errors with registering the user, catch and display them.
    } catch (errors) {
      this.setState({ errors });
    }
  };

  render() {
    return (
      <div>
        <div
          className="mh-fullscreen bg-img center-vh p-20"
          style={{
            backgroundImage: `url(${
              process.env.PUBLIC_URL
            }/assets/img/bg-girl.jpg)`
          }}
        >
          <div
            className="card card-shadowed p-50 w-400 mb-0"
            style={{ maxWidth: "100%" }}
          >
            <h5 className="text-uppercase text-center">Register</h5>
            <br />
            <br />
            <form className="form-type-material" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  onChange={this.handleInputChange}
                  type="text"
                  className="form-control"
                  placeholder="Username"
                />
                {this.state.errors["name"] && (
                  <small className="text-danger">
                    {this.state.errors["name"]}
                  </small>
                )}
              </div>
              <div className="form-group">
                <input
                  name="email"
                  onChange={this.handleInputChange}
                  type="text"
                  className="form-control"
                  placeholder="Email address"
                />
                {this.state.errors["email"] && (
                  <small className="text-danger">
                    {this.state.errors["email"]}
                  </small>
                )}
              </div>
              <div className="form-group">
                <input
                  name="password"
                  onChange={this.handleInputChange}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                />
                {this.state.errors["password"] && (
                  <small className="text-danger">
                    {this.state.errors["password"]}
                  </small>
                )}
              </div>
              <div className="form-group">
                <input
                  name="password_confirmation"
                  onChange={this.handleInputChange}
                  type="password"
                  className="form-control"
                  placeholder="Password (confirm)"
                />
              </div>
              <br />
              <button
                className="btn btn-bold btn-block btn-primary"
                type="submit"
              >
                Register
              </button>
            </form>
            <hr className="w-30" />
            <p className="text-center text-muted fs-13 mt-20">
              Already have an account?
              <a href="login.html">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
