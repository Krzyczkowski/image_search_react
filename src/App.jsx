import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "axios";
import { Form, Button } from "react-bootstrap";


const App = () => {
  const API_URL = "https://api.unsplash.com/search/photos";
  const IMG_PER_PAGE = 20;
  const searchData = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);



  const searchHandler = (event) => {
    event.preventDefault();
    setPage(1);
    fetchImages();
  };
  const filterHandler = (filter) => {
    searchData.current.value = filter;
    fetchImages();
  };



  const fetchImages = useCallback( async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}?query=${
          searchData.current.value
        }&page=${page}&per_page=${IMG_PER_PAGE}&client_id=${
          import.meta.env.VITE_API_KEY
        }`
      );
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log(error);
    }
  });
  useEffect(()=>{
    fetchImages();
  },[fetchImages,page]);
  
  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      <div className="search-section">
        <Form onSubmit={searchHandler} className="searchInput">
          <Form.Control
            type="search"
            placeholder="Search photos..."
            className="search-form"
            ref={searchData}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => filterHandler("Office")}>Office</div>
        <div onClick={() => filterHandler("Dogs")}>Dogs</div>
        <div onClick={() => filterHandler("Cats")}>Cats</div>
        <div onClick={() => filterHandler("Trees")}>Trees</div>
      </div>
      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="image"
          />
        ))}
      </div>
      <div className="buttons">
        {page > 1 && <Button onClick= {() => setPage(page - 1)}>Previous</Button>}
        {page < totalPages && <Button onClick= {() => setPage(page + 1)}>Next</Button>}
      </div>
    </div>
  );
};

export default App;
