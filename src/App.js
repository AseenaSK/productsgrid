import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import axios from 'axios'
import './App.css'

const Home = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          'https://fakestoreapi.com/products?limit=5',
        )
        setImages(response.data.map(product => product.image))
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIndex, images])

  return (
    <div className="home">
      <h1>Welcome to Store</h1>
      <div className="image-slider">
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Slider ${index}`}
            className={index === currentIndex ? 'active' : ''}
          />
        ))}
      </div>
      <p className="p1">
        Explore our amazing products! <br />
        Common Click on the products section
      </p>
    </div>
  )
}

const ProductsGrid = ({products}) => (
  <div className="product-grid">
    {products.map(product => (
      <Link
        to={`/product/${product.id}`}
        key={product.id}
        className="product-item"
      >
        <img src={product.image} alt={product.title} />
        <p>{product.title}</p>
      </Link>
    ))}
  </div>
)

const ProductDetails = ({match}) => {
  const [product, setProduct] = useState(null)
  const productId = match.params.id

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${productId}`,
        )
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product details:', error)
      }
    }

    fetchProductDetails()
  }, [productId])

  return (
    <div>
      <h2>Product Details</h2>
      {product ? (
        <div className="product-details">
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  )
}

const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
      </ul>
    </nav>
  </header>
)

const App = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products')
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <Router>
      <div className="app">
        <Header />
        <Route path="/" exact component={Home} />
        <Route
          path="/products"
          render={() => <ProductsGrid products={products} />}
        />
        <Route path="/product/:id" component={ProductDetails} />
      </div>
    </Router>
  )
}

export default App
