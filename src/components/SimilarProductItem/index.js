// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, brand, rating, price} = productDetails

  return (
    <li className="similar-product-detail">
      <img
        className="similar-product-image"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="product-name">{title}</h1>
      <p className="pro-name-brand">by {brand}</p>
      <div className="tar-rating">
        <p className="product-price">Rs {price}/- </p>
        <div className="review-star-container">
          <p className="no-of-star">{rating}</p>
          <img
            className="star-image"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
