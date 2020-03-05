import React from "react";
import { Link, withRouter } from "react-router-dom"
import { Mutation } from "react-apollo"
import Mutations from "../../graphql/mutations"
import Queries from "../../graphql/queries"
const { FOLLOW_TOPIC } = Mutations
const { FETCH_TOPICS } = Queries

class TopicHeader extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      message: "",
      follow: false
    }
    this.renderFollowIcon = this.renderFollowIcon.bind(this)
    this.countFollowers = this.countFollowers.bind(this)
  }
  updateCache(cache, { data }) {
    // let topics = cache.readQuery({ query: FETCH_TOPICS })
    // try {
    //   topics = cache.readQuery({ query: FETCH_TOPICS });
    // } catch (err) {
    //   return;
    // }
    // if (topics) {
    //   let topicsArray = topics.topics;
    //   let newTopic = data.newTopic;
    //   cache.writeQuery({
    //     query: FETCH_TOPICS,
    //     data: { topics: topicsArray.concat(newTopic) }
    //   });
    // }
  }
  countFollowers() {
    console.log(this.props.topic)
    // let followers = Array.from(this.props.topic.followers)
    // console.log(followers.length)
    return 4
  }

  handleClick(e, followTopic) {
    e.preventDefault()
    followTopic({ variables: { topicId: this.props.topic._id } })
    this.setState({
      follow: !this.state.follow
    })
  }

  renderFollowIcon() {
    if (this.state.follow) {
      return <div id="follow-icon-pressed">
        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g stroke="none" fill="none" fill-rule="evenodd">
            <path d="M20.25,14.3388626 C19.9783814,14.4955 19.7318899,14.7061926 19.5273952,14.9688404 L17.7662908,17.2307581 C16.7898614,16.2559226 15.2080519,16.2564142 14.232233,17.232233 C13.4142783,18.0501878 13.2816074,19.2939234 13.8342204,20.25 L7.5,20.25 C5.42893219,20.25 3.75,18.5710678 3.75,16.5 L3.75,7.5 C3.75,5.42893219 5.42893219,3.75 7.5,3.75 L16.5,3.75 C18.5710678,3.75 20.25,5.42893219 20.25,7.5 L20.25,14.3388626 Z M8,7.75 C7.58578644,7.75 7.25,8.08578644 7.25,8.5 L7.25,12.5 C7.25,12.9142136 7.58578644,13.25 8,13.25 L12,13.25 C12.4142136,13.25 12.75,12.9142136 12.75,12.5 L12.75,8.5 C12.75,8.08578644 12.4142136,7.75 12,7.75 L8,7.75 Z M14.5,9.75 L16,9.75 C16.4142136,9.75 16.75,9.41421356 16.75,9 C16.75,8.58578644 16.4142136,8.25 16,8.25 L14.5,8.25 C14.0857864,8.25 13.75,8.58578644 13.75,9 C13.75,9.41421356 14.0857864,9.75 14.5,9.75 Z M14.5,12.75 L16,12.75 C16.4142136,12.75 16.75,12.4142136 16.75,12 C16.75,11.5857864 16.4142136,11.25 16,11.25 L14.5,11.25 C14.0857864,11.25 13.75,11.5857864 13.75,12 C13.75,12.4142136 14.0857864,12.75 14.5,12.75 Z M8,16.25 L16,16.25 C16.4142136,16.25 16.75,15.9142136 16.75,15.5 C16.75,15.0857864 16.4142136,14.75 16,14.75 L8,14.75 C7.58578644,14.75 7.25,15.0857864 7.25,15.5 C7.25,15.9142136 7.58578644,16.25 8,16.25 Z" class="icon_svg-fill_as_stroke" fill="#666" fill-rule="nonzero"></path>
            <polyline class="icon_svg-stroke" stroke="#329bff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="16 18.9953112 18 20.9953112 21.5 16.5"></polyline>
          </g>
        </svg>
      </div>
    } else {
      return <div id="follow-icon-unpressed">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g className="icon_svg-stroke" stroke="#329bff" stroke-width="1.5" fill="none" fill-rule="evenodd" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.5 19.5h-6a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v6M8 12.5v-4h4v4H8zM14.5 9H16h-1.5zm0 3H16h-1.5zM8 15.5h8-8zm9 4h5M19.5 17v5"></path>
          </g>
        </svg>
      </div>
    }
  }

  render() {
    return (
      <div className="TopicPageHeader" >
        <div className="TopicPageHeader-Top flex">
          <div className="photo-container">
            <div className="TopicPhoto">
              <div className="topic_photo_img">
                <Link to="/topic/Technology">
                  <div className="icon-background">
                    <div className="icon">
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="topic-content">
            <div className="TopicName">
              <h1>{this.props.topic.name}</h1>
            </div>
            <div>
              <div className="icon_action_bar">
                <div className="icon_action_bar-inner flex">
                  <div className="topic_item follow-icon">
                    <span>
                      <Mutation
                        mutation={FOLLOW_TOPIC}
                        update={this.updateCache}
                        onError={err => this.setState({ message: err.message })}
                        update={(cache, data) => this.updateCache(cache, data)}
                        onCompleted={data => {
                          this.updateCache(data)
                        }}
                      >
                        {(followTopic) => (
                          <div className="ui_button-inner flex" onClick={(e) => this.handleClick(e, followTopic)}>
                            <div className="ui_button_icon_wrapper" >
                              {this.renderFollowIcon()}
                            </div>
                            <div className="ui_button_count_wrapper">
                              <span className="ui_button_label">Follow</span>
                              <span className="ui_button_count">
                                <span className="bullet">.</span>
                                <span className="ui_button_count_inner">{this.countFollowers()}</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </Mutation>
                    </span>
                  </div>
                  <div className="topic_item bookmark">
                    <span>
                      <a className="ui_button-inner">
                        <div className="ui_button_icon_wrapper flex">
                          <div id="bookmark-icon">
                            <span className="ui_button_icon">
                              <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g id="bookmark" className="icon_svg-stroke icon_svg-fill" stroke="#666" fill="none" stroke-width="1.5" fill-rule="evenodd" stroke-linejoin="round">
                                  <polygon points="12.0014329 15 5.50286589 20 5.5 5 18.5 5 18.5 20"></polygon>
                                </g>
                              </svg>
                            </span>
                          </div>
                          <div className="ui_button_label">
                            <span className="ui_button_label">Bookmark</span>
                          </div>
                        </div>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default withRouter(TopicHeader);