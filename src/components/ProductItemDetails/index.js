// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apistatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductData: [],
    apiStatus: apistatusConstant.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItem()
  }

  getFormattedData = data => ({
    id: data.id,
    availability: data.availability,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    description: data.description,
    price: data.price,
    style: data.style,
  })

  getProductItem = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apistatusConstant.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )

      this.setState({
        productData: updatedData,
        similarProductData: updatedSimilarProductsData,
        apiStatus: apistatusConstant.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        apiStatus: apistatusConstant.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="not-found-container">
      <img
        className="error-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="not-found-text">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailedView = () => {
    const {productData, quantity, similarProductData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div className="specific-product-container">
        <div className="particular-product-detail">
          <div className="product-image-container">
            <img className="image-product" src={imageUrl} alt="products" />
          </div>
          <div className="product-detail-container">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/- </p>
            <div className="star-review-container">
              <div className="star-container">
                <p className="no-of-star">{rating}</p>
                <img
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="review-text">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="ava-brand-container">
              <p className="ava-text">Available: </p>
              <p className="span-text">{availability}</p>
            </div>
            <div className="ava-brand-container">
              <p className="ava-text">Brand: </p>{' '}
              <p className="span-text">{brand}</p>
            </div>
            <hr />
            <div className="no-of-product-container">
              <button
                className="btn"
                type="button"
                data-testid="minus"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare className="inc-dec-icon" />
              </button>
              <p className="no-of-product">{quantity}</p>
              <button
                className="btn"
                type="button"
                data-testid="plus"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare className="inc-dec-icon" />
              </button>
            </div>
            <button className="cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="similar-product-list">
          {similarProductData.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              productDetails={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apistatusConstant.success:
        return this.renderProductDetailedView()
      case apistatusConstant.failure:
        return this.renderFailureView()
      case apistatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-detail-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
