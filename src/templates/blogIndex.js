import React from "react"
import { Link, graphql } from "gatsby"
import get from "lodash/get"
import Img from "gatsby-image"
import { Container, Row, Col } from "reactstrap"

import SEO from "../components/global/seo"
import Layout from "../components/global/layout"

class BlogIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filterTags: [],
      showFilterTags: false,
    }
    this._editFilterTags = this._editFilterTags.bind(this)
  }

  _editFilterTags(tag) {
    if (this.state.filterTags.includes(tag)) {
      this.setState({
        filterTags: this.state.filterTags.filter(e => e !== tag),
      })
    } else {
      this.setState({ filterTags: this.state.filterTags.concat(tag) })
    }
  }
  render() {
    const pageColor = "yellow"
    const borderColor = "site-border-yellow"
    //// Import state
    const { filterTags, showFilterTags } = this.state
    const { pageContext, location } = this.props
    const {
      humanPageNumber,
      pageNumber,
      limit,
      numberOfPages,
      nextPagePath,
      previousPagePath,
    } = pageContext

    //// Organize content from graphql & filtered data
    const siteTitle = get(this, "props.data.site.siteMetadata.title")
    const blogPosts = get(this, "props.data.allContentfulBlogPost.edges")

    // this obj contains all the blog posts
    console.log(blogPosts)

    let articleCount = blogPosts.length

    //// Logic to match articles to filter tags
    let filteredPosts
    if (filterTags.length) {
      filteredPosts = blogPosts.filter(i => {
        let { tags } = i.node
        if (tags) {
          for (let i = 0; i < tags.length; i++) {
            for (let j = 0; j < filterTags.length; j++) {
              if (tags[i] === filterTags[j]) {
                return true
              }
            }
          }
          return false
        }
      })
    }

    //// Create list of available tags from the CMS
    let availableTags = []
    blogPosts.forEach(i => {
      if (i.node.tags) {
        i.node.tags.forEach(t => {
          availableTags.push(t)
        })
      }
    })
    availableTags = [...new Set(availableTags)]

    //// Create render for list of tags
    // let tagOptions = availableTags.map((i, idx) => {
    //   let active = filterTags.includes(i)
    //   return (
    //     <div
    //       key={idx}
    //       className={
    //         "position-relative tag body-small " + (active ? "active" : "")
    //       }
    //       onClick={() => this._editFilterTags(i)}
    //     >
    //       {i}
    //       {active ? (
    //         <img
    //           src={exit}
    //           alt=""
    //           style={{
    //             position: "absolute",
    //             width: "15px",
    //             top: "-5px",
    //             right: "0px",
    //           }}
    //         />
    //       ) : (
    //         ""
    //       )}
    //     </div>
    //   )
    // })

    //// Create Pagination Logic
    // let slice_start = pageNumber * limit
    // let slice_end = humanPageNumber * limit
    // let pageArticles = library.slice(slice_start, slice_end)

    // let pagination =
    //   numberOfPages > 1 ? (
    //     <div className="pagination">
    //       <div className="eyebrow">PAGE</div>
    //       <div className="pages">
    //         <div className="page-back">
    //           {previousPagePath !== "" ? (
    //             <Link to={previousPagePath}>Previous</Link>
    //           ) : (
    //             <div className="disabled">Previous</div>
    //           )}
    //         </div>
    //         {[...Array(numberOfPages).keys()].map((i, idx) => {
    //           let current = i + 1
    //           let path = i === 0 ? "" : current
    //           return (
    //             <div
    //               key={idx}
    //               className={
    //                 "page-number " + (i === pageNumber ? "active" : "")
    //               }
    //             >
    //               <Link to={"/resources/library/" + path}>{current}</Link>
    //             </div>
    //           )
    //         })}
    //         <div className="page-next">
    //           {nextPagePath !== "" ? (
    //             <Link to={nextPagePath}>Next</Link>
    //           ) : (
    //             <div className="disabled">Next</div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   ) : (
    //     ""
    //   )

    // console.log(pageArticles)

    //// Create unfiltered page view
    // let unfiltered = (
    //   <>
    //     <LibraryTwoPost posts={pageArticles.slice(0, 3)} />
    //     <LibraryTwoPost posts={pageArticles.slice(3, 6)} />
    //     <LibraryTwoPost posts={pageArticles.slice(6, 9)} />
    //     <LibraryTwoPost posts={pageArticles.slice(9, 12)} />
    //     <LibraryTwoPost posts={pageArticles.slice(12, 15)} />
    //     {pagination}
    //     <LibraryFeatured posts={featured} />
    //     <EmailCapture color={"#fdfc71"} text={"#000"} />
    //   </>
    // )

    // let filtered = <LibraryTwoPost posts={filteredPosts} />

    // let pageRender = filterTags.length ? filtered : unfiltered

    let pageRender = <div></div>

    return (
      <Layout
        location={location}
        location={location}
        path={location.pathname}
        borderColor={borderColor}
        footerColor={pageColor}
      >
        <SEO title="Blog" />
        <div id="libraryPage">{pageRender}</div>
      </Layout>
    )
  }
}

export default BlogIndex

export const IndexBlogQuery = graphql`
  query IndexBlogQuery {
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
      edges {
        node {
          title
          slug
          description {
            description
          }
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          heroImage {
            fluid(resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid
            }
          }
        }
      }
    }
  }
`