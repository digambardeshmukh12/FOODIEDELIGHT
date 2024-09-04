import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';



type StarType = 'full' | 'half' | 'fraction' | 'empty';

interface Star {
  type: StarType;
  width?: number;
}
@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  paginatedRestaurants: Restaurant[] = [];
  AllrestaurantsStore: Restaurant[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  countRestro: number = 0;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe(data => {
      debugger
      this.restaurants = data;
      this.countRestro = data.length
      this.filteredRestaurants = data
      this.updatePagination()
      this.AllrestaurantsStore = JSON.parse(JSON.stringify(data))
    } );
  }

  editRestaurant(id: number): void {
    if (id !== undefined) {
      this.router.navigate(['/restaurants/edit', id]);
    } else {
      console.error('Invalid restaurant ID');
    }
  }

  deleteRestaurant(id: number): void {
    if (id !== undefined && confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(id).subscribe(
        () => this.loadRestaurants(),
        (error) => console.error('Error deleting restaurant', error)
      );
    }
  }

  viewDetails(id: any): void {
    debugger
    if (id !== undefined) {
      this.router.navigate(['/restaurants/details', id]);
    } else {
      console.error('Invalid restaurant ID');
    }
  }

  

  getStarsArray(rating: number | undefined): Star[] {
    const stars: Star[] = [];
    const normalizedRating = Math.floor(rating ?? 0); // Remove decimals and floor the rating
  
    for (let i = 0; i < 10; i++) {
      if (i < normalizedRating) {
        stars.push({ type: 'full' });
      } else {
        stars.push({ type: 'empty' });
      }
    }
  
    return stars;
  }

  availableRatings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedRating = 0
   searchinput = ''
  onSearch(): void {
    debugger
    this.filteredRestaurants = this.AllrestaurantsStore.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(this.searchinput.toLowerCase());
      const matchesRating = this.selectedRating ? restaurant.rating! >= this.selectedRating : true;
      return matchesSearch && matchesRating;
    });
    this.countRestro = this.filteredRestaurants.length

    this.updatePagination();


  }

  OnFilter(){
     debugger
    this.filteredRestaurants = this.AllrestaurantsStore.filter(restaurant =>
      restaurant.name.toLowerCase().includes(this.searchinput.toLowerCase())
    );
    this.countRestro = this.filteredRestaurants.length

    this.updatePagination();
  }
 
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.restaurants = this.filteredRestaurants.slice(startIndex, endIndex);
  }

}