export const API_ENDPOINTS = {
  BASE: 'https://movie-booking-backend-2-i5ap.onrender.com/api/v1.0/moviebooking',

  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT: '/forgot',
    RESET: '/reset'
  },

  MOVIES: {
    SEARCH: '/movies/search',
    GET_ALL: '/all',
    ADD: '/addMovie',                
    DELETE: (movie: string, theatre: string) =>
      `/${movie}/delete/${theatre}`,  
    UPDATE_STATUS: (movie: string, theatre: string) =>
      `/updateStatus/${movie}/${theatre}` 
  },

  BOOKING: {
    BOOK: '/book',
    VIEW: '/view/booking'            
  }
};