import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;

  const root_url = window.location.origin + "/";
  const dealer_url = root_url + `djangoapp/dealer/${id}`;
  const review_url = root_url + `djangoapp/add_review`;
  const carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if(name.includes("null")) name = sessionStorage.getItem("username");

    if(!model || !review || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `/dealer/${id}`;
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    if(retobj.status === 200) {
      setDealer(retobj.dealer[0] || {});
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    setCarmodels(retobj.CarModels || []);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{margin: "5%", maxWidth: "600px", padding: "20px", backgroundColor: "#f5f8fa", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
        <h2 style={{color: "#1a73e8", marginBottom: "20px"}}>{dealer.full_name}</h2>

        <div className='input_field'>
          <label>Write your review</label>
          <textarea 
            cols='50' 
            rows='5' 
            placeholder='Share your experience...' 
            value={review} 
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <div className='input_field'>
          <label>Purchase Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className='input_field'>
          <label>Car Make & Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map(c => (
              <option key={c.CarMake + c.CarModel} value={`${c.CarMake} ${c.CarModel}`}>
                {c.CarMake} {c.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className='input_field'>
          <label>Car Year</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} min="2015" max={new Date().getFullYear()} placeholder="YYYY"/>
        </div>

        <div style={{marginTop: "20px"}}>
          <button 
            className='postreview' 
            style={{padding: "10px 20px", backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}} 
            onClick={postreview}
            disabled={!review || !model || !year || !date}
          >
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
