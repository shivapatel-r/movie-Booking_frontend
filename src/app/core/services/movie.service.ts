import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from './api-endpoints';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = API_ENDPOINTS.BASE;

  constructor(private http: HttpClient) {}

  // ✅ GET ALL MOVIES (UPDATED)
  getAllMovies() {
    return this.http.get<any[]>(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.GET_ALL}`
    );
  }
}