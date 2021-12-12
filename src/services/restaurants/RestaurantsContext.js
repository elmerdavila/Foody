import React, { useState, useEffect, createContext, useContext } from 'react';

import {
  restaurantsRequest,
  restaurantsTransform,
} from './restaurants.service';

import { LocationContext } from '../location/LocationContext';

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pricelevel, setPricelevel] = useState(null);
  const { location } = useContext(LocationContext);

  const retrieveRestaurants = (loc, pricelevel) => {
    setIsLoading(true);
    setRestaurants([]);

    restaurantsRequest(loc, pricelevel)
      .then(restaurantsTransform)
      .then((results) => {
        let resultrestaurant = [];
        for (let i in results) {
          if (results[i].priceLevel == pricelevel) {
            resultrestaurant.push(results[i]);
            console.log('LOS3CORES', results[i]);
          }
        }
        setError(null);
        setIsLoading(false);
        setRestaurants(resultrestaurant);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  };

  useEffect(() => {
    if (location) {
      const locationString = `${location.lat},${location.lng}`;
      retrieveRestaurants(locationString, pricelevel);
    }
  }, [location, pricelevel]);

  return (
    <RestaurantsContext.Provider
      value={{ restaurants, isLoading, error, pricelevel, setPricelevel }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
};
